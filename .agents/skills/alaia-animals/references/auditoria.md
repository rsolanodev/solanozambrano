# Auditoría profunda de medios

Úsala cuando pidan revisar toda la app antes de enseñarla, cuando sospechen que un medio no corresponde a su animal o cuando quieran comprobar la calidad más allá de los tests. La auditoría es de solo lectura salvo que se pida otra cosa: escribe scripts temporales en `/tmp`, no en el repositorio.

Antes de empezar, localiza los binarios y exporta las variables como se explica en `procesamiento-medios.md`:

```bash
export FFMPEG=/tmp/ffmpeg-7.0.2-amd64-static/ffmpeg
export FFPROBE=/tmp/ffmpeg-7.0.2-amd64-static/ffprobe
```

## 1. Inventario y referencias

Comprueba que cada animal tiene sus cuatro rutas, que no hay rutas duplicadas ni archivos huérfanos y que `CREDITS.md` tiene una sección por animal. Un script Node breve desde la raíz:

```bash
node - <<'NODE'
const fs = require("node:fs");
const path = require("node:path");
const animals = require("./src/lib/alaia-animals.json");
const refs = new Set();
const problems = [];
const expected = [];
for (const animal of animals) {
  const paths = [animal.video, animal.poster, animal.audio, animal.sign.image];
  for (const url of paths) {
    if (refs.has(url)) problems.push(`duplicada: ${url}`);
    refs.add(url);
    const file = path.join("public", url.replace(/^\//, ""));
    expected.push(file);
    if (!fs.existsSync(file)) problems.push(`falta: ${url}`);
    else if (fs.statSync(file).size === 0) problems.push(`vacío: ${url}`);
  }
}
const all = [];
for (const dir of ["video", "poster", "audio", "signos"]) {
  const base = path.join("public/alaia/animales", dir);
  for (const name of fs.readdirSync(base)) all.push(path.join(base, name));
}
const orphans = all.filter((file) => !expected.includes(file));
const credits = fs.readFileSync("public/alaia/animales/CREDITS.md", "utf8");
const missingCredits = animals.filter((a) => !credits.includes(`## ${a.name}`));
console.log({ animals: animals.length, refs: refs.size, problems, orphans, missingCredits: missingCredits.map((a) => a.id) });
NODE
```

Comprueba también hashes duplicados; dos animales no deberían compartir el mismo archivo:

```bash
for dir in video poster audio signos; do
  sha256sum public/alaia/animales/$dir/* | sort | uniq -w64 -d
done
```

## 2. Decodificación, dimensiones y duración

```bash
for f in public/alaia/animales/video/*.mp4; do
  "$FFPROBE" -v error -show_entries format=duration,size,bit_rate \
    -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate \
    -of default=noprint_wrappers=1 "$f"
  "$FFMPEG" -v error -i "$f" -f null -
done
```

Espera H.264, 720×720, 30 fps, `yuv420p`, sin audio y duración cercana a 5 s. Para detectar fotogramas negros o imagen congelada:

```bash
for f in public/alaia/animales/video/*.mp4; do
  "$FFMPEG" -hide_banner -nostats -i "$f" -vf "blackdetect=d=0.1:pix_th=0.10" -an -f null -
  "$FFMPEG" -hide_banner -nostats -i "$f" -vf "freezedetect=n=0.003:d=0.5" -an -f null -
done
```

## 3. Póster contra el fotograma de origen

El build extrae el póster a los 0.6 s. Compara ese fotograma con el JPG mediante SSIM; por debajo de 0.97 suele indicar un póster de otro video o de otro instante:

```bash
for f in public/alaia/animales/video/*.mp4; do
  id=$(basename "$f" .mp4)
  "$FFMPEG" -y -loglevel error -ss 0.6 -i "$f" -frames:v 1 "/tmp/$id-frame.png"
  "$FFMPEG" -hide_banner -i "public/alaia/animales/poster/$id.jpg" \
    -i "/tmp/$id-frame.png" -lavfi ssim -f null - 2>&1 | grep "SSIM"
done
```

## 4. Audio: verdadero pico, loudness y silencios

`volumedetect` da el pico de muestra, pero no el verdadero pico entre muestras. Para medios que se van a publicar, revisa `ebur128`:

```bash
for f in public/alaia/animales/audio/*.mp3; do
  echo "== $f"
  "$FFMPEG" -hide_banner -nostats -i "$f" -af "ebur128=peak=true" -f null - 2>&1 | tail -n 20
done
```

Lee `I:` (loudness integrado, en LUFS) y `Peak:` (true peak, en dBFS). Un true peak por encima de 0 dBFS puede distorsionar en algunos reproductores; para medios nuevos apunta a −1.5 dBTP. Anota también la diferencia de loudness entre animales: más de 3 LU entre el más suave y el más fuerte se nota al cambiar de tarjeta.

Silencios:

```bash
for f in public/alaia/animales/audio/*.mp3; do
  echo "== $f"
  "$FFMPEG" -hide_banner -nostats -i "$f" \
    -af "silencedetect=noise=-40dB:d=0.25" -f null - 2>&1 | grep silence
done
```

Un silencio inicial de 0.3 s se percibe como un retraso al tocar la tarjeta. No es un archivo roto, pero merece un aviso.

## 5. ¿El audio corresponde a la fuente declarada?

Para una muestra de animales, descarga la fuente original y compara la envolvente de energía con la del archivo local. Correlaciones altas y desfases coherentes con `sources.audio.start` confirman que el recorte es el correcto y que no se cruzó un audio. Es un chequeo caro; úsalo cuando haya dudas o en una auditoría completa.

## 6. Revisión visual

Genera una hoja de contactos con los 22 pósters y otra con los 22 signos. Para videos con poco movimiento, extrae una tira de 5 fotogramas de cada uno. Comprueba que el animal es el correcto y que el signo corresponde a la especie.

```bash
# Pósters en una sola imagen
"$FFMPEG" -y -loglevel error -pattern_type glob -i "public/alaia/animales/poster/*.jpg" \
  -vf "scale=180:180,tile=6x4" -frames:v 1 /tmp/alaia-check/posters.jpg
```

## 7. Informe

Un buen informe de auditoría incluye:

1. Veredicto claro: qué está bien y qué es bloqueante.
2. Inventario: número de animales y archivos, tamaños mínimos/máximos, huérfanos.
3. Comprobaciones técnicas por tipo: decodificación, dimensiones, duración, póster, audio, signo.
4. Observaciones no bloqueantes: picos, volumen desigual, silencios, diferencias visuales.
5. Evidencia: comandos y resultados, no solo afirmaciones.
6. Confirmación de que no se modificó el repositorio.

No confundas "no hay archivos faltantes" con "todo suena perfecto". Separa los problemas técnicos de los matices de calidad; así la persona usuaria decide qué pulir.