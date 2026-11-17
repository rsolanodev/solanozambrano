# Procesamiento y verificación de medios

## Localizar ffmpeg y ffprobe

El proyecto no incluye ffmpeg como dependencia. Primero busca en el sistema y en binarios estáticos de `/tmp`:

```bash
command -v ffmpeg
command -v ffprobe
ls -d /tmp/ffmpeg-*-amd64-static 2>/dev/null
```

Si no hay ninguno, descarga un build estático:

```bash
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
  -o /tmp/ffmpeg.tar.xz
tar -xf /tmp/ffmpeg.tar.xz -C /tmp
FFMPEG=$(ls -d /tmp/ffmpeg-*-amd64-static/ffmpeg | head -n 1)
FFPROBE=$(ls -d /tmp/ffmpeg-*-amd64-static/ffprobe | head -n 1)
"$FFMPEG" -version
```

Pasa el binario al script de build:

```bash
FFMPEG="$FFMPEG" node scripts/build-alaia-media.mjs --force --only=<id>
```

No agregues ffmpeg a `package.json` solo para una tarea puntual; el build estático en `/tmp` es suficiente.

## Inspeccionar un archivo

```bash
"$FFPROBE" -v error \
  -show_entries format=duration,size,bit_rate \
  -show_entries stream=codec_name,width,height,r_frame_rate,channels,sample_rate \
  -of default=noprint_wrappers=1 /ruta/al/archivo
```

Para video, comprueba:

- `width=720`, `height=720` en el archivo final;
- códec `h264`;
- duración cercana a la configurada (5 s);
- tamaño por debajo de 2 MB.

Para audio, comprueba:

- duración de 2–7 s (usa `repeat` si la llamada natural es más corta);
- MP3 mono a 44.1 kHz;
- tamaño por debajo de 500 KB;
- sin clipping.

Para poster y signo, revisa dimensiones y tamaño:

- poster: cuadrado, menos de 300 KB;
- signo: 960×480, menos de 250 KB.

## Recorte cuadrado del video

El script escala el resultado a 720×720. El campo `crop` se aplica antes del escalado, sobre el video original. Calcula el cuadrado con las dimensiones reales:

| Fuente | Cuadrado | Desplazamiento horizontal |
| --- | --- | --- |
| 1920×1080 | `crop=1080:1080:X:0` | `X` entre 0 y 840; centrado = 420 |
| 3840×2160 | `crop=2160:2160:X:0` | `X` entre 0 y 1680; centrado = 840 |
| 1080×1920 | `crop=1080:1080:0:Y` | `Y` entre 0 y 840; centrado = 420 |
| 720×1280 | `crop=720:720:0:Y` | `Y` entre 0 y 560; centrado = 280 |

`crop: "center"` deja el cuadrado centrado automáticamente. Úsalo solo si el animal está en el centro; para mantener la cabeza o el cuerpo completo, ajusta `X`/`Y` a mano.

Regla práctica: si el animal se mueve, deja margen a ambos lados. Es mejor un plano un poco más abierto que un recorte que le corte la cabeza en algún fotograma.

## Revisar todo el clip

Una hoja de contacto de 10 fotogramas (2 por segundo durante 5 s):

```bash
mkdir -p /tmp/alaia-check
"$FFMPEG" -y -loglevel error -i /tmp/alaia-check/<id>.mp4 \
  -vf "fps=2,scale=240:-1,tile=5x2" \
  -frames:v 1 /tmp/alaia-check/<id>-strip.jpg
```

Ábrela con la herramienta de lectura de imágenes. Revisa el primer y el último fotograma con especial atención: ahí suelen aparecer los cortes de cabeza, las entradas en negro o los cambios de plano.

Para un detalle concreto:

```bash
"$FFMPEG" -y -loglevel error -ss 2.5 -i /tmp/alaia-check/<id>.mp4 \
  -frames:v 1 /tmp/alaia-check/<id>-frame.jpg
```

El poster final se extrae a los 0.6 s del video ya recortado. Si ese fotograma no representa bien al animal, ajusta `start` o elige otro segmento; no edites el poster a mano.

## Niveles de audio

Nivel medio y pico:

```bash
"$FFMPEG" -hide_banner -i public/alaia/animales/audio/<id>.mp3 \
  -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```

Silencios:

```bash
"$FFMPEG" -hide_banner -i public/alaia/animales/audio/<id>.mp3 \
  -af "silencedetect=noise=-45dB:d=0.15" -f null - 2>&1 | grep silence
```

Loudness integrado (útil para comparar antes y después):

```bash
"$FFMPEG" -hide_banner -i public/alaia/animales/audio/<id>.mp3 \
  -af "ebur128=peak=true" -f null - 2>&1 | tail -n 20
```

Objetivos:

- pico por debajo de −1 dBFS; si se acerca a 0, hay riesgo de distorsión;
- sin silencios largos al inicio ni al final;
- para voces suaves, no subir el volumen hasta que suene artificial;
- para rugidos, se puede usar `loudness: -13.5` y `bass: 3`, pero revisa el pico después.

## Campos de audio del JSON

| Campo | Cuándo usarlo |
| --- | --- |
| `start` | Saltar una introducción, un ruido o una parte poco clara. |
| `duration` | Recortar a 4–6 s; el script aplica fades de 0.03 s y 0.25 s. |
| `trimSilence` | Quitar el silencio inicial de una grabación de Wikimedia. |
| `repeat` | Repetir una llamada corta (por ejemplo, un maullido de 1.6 s). |
| `gap` | Separación entre repeticiones; 1.0–1.3 s funciona bien para llamadas cortas. |
| `loudness` | Objetivo integrado en LUFS; por defecto −16. |
| `bass` | Ganancia en dB a 90 Hz; 2–4 para dar cuerpo sin emborronar. |

Orden del procesado en el script: silencio → graves → loudness → fades. Si un audio necesita algo distinto, primero intenta resolverlo con estos campos; solo modifica el script si el cambio beneficia a varios animales.

## Video: parámetros que aplica el script

- recorte `crop` (o cuadrado centrado con `center`);
- escala a 720×720;
- 30 fps;
- H.264, `crf 28`, `yuv420p`, `faststart`;
- sin pista de audio;
- segmento de `start` a `start + duration`.

No hace falta recompilar a mano: cambia el JSON y vuelve a ejecutar el build.

## Errores y soluciones

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `crop` fuera de rango | Coordenadas mayores que el video | Recalcula con `ffprobe`. |
| Video en negro | `start` cae en una transición | Prueba otro `start` y muestrea. |
| Poster borroso | El frame de 0.6 s tiene movimiento | Elige otro segmento o ajusta `start`. |
| Audio saturado | `loudness` o `bass` demasiado altos | Baja el valor y revisa el pico. |
| Audio casi inaudible | Fuente con mucho silencio o nivel bajo | Usa `trimSilence` y sube `loudness` con moderación. |
| Descarga 429 | Límite de Wikimedia | Espera y reintenta; conserva el archivo anterior. |
| Descarga 403 | Pexels bloquea la página | Usa `r.jina.ai` para leer y el endpoint de descarga con User-Agent. |
| `ffmpeg: not found` | No está en PATH | Usa el binario estático de `/tmp` o descárgalo. |

## Verificación final

```bash
node .agents/skills/alaia-animals/scripts/verify-media.mjs <id>
node .agents/skills/alaia-animals/scripts/verify-media.mjs <id> --frames
```

El script no sustituye la revisión visual: úsalo para descartar problemas técnicos y luego mira la hoja de contacto y el poster.