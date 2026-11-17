---
name: alaia-animals
description: Gestiona la app de animales de Alaia en este repositorio: agrega, edita o elimina animales; reemplaza videos, audios, posters y signos; mantén créditos, textos y pruebas coherentes; y verifica que los medios se vean y suenen bien. Úsala siempre que se pida tocar cualquier animal, medio o crédito de la app de animales, aunque no se nombren archivos, rutas ni la skill.
---

# App de animales de Alaia

## Qué es y por qué importa

`/alaia/animales` es la galería de animales de "Mundo de Alaia": una cuadrícula de tarjetas y un reproductor a pantalla completa. La usa una niña, así que cada video debe ser claro y tranquilo, cada sonido debe ser reconocible y amable, y ningún texto debe resultar inquietante.

La app se genera a partir de una sola fuente de verdad y de un script de medios. Si editas a mano los archivos de `public/`, el siguiente build los pisa o los créditos quedan desincronizados. Por eso el flujo siempre es: **editar el JSON → generar medios → verificar → actualizar pruebas y créditos**.

## Mapa del proyecto

| Ruta | Para qué sirve |
| --- | --- |
| `src/lib/alaia-animals.json` | Fuente de verdad: datos, rutas, fuentes y parámetros de procesado de todos los animales. |
| `src/lib/alaia-animals.ts` | Tipos y helpers (`getAlaiaAnimal`). |
| `scripts/build-alaia-media.mjs` | Descarga, recorta, normaliza y genera videos, posters, audios, signos y `CREDITS.md`. |
| `public/alaia/animales/video/` | Videos finales (720×720, H.264, ~5 s). |
| `public/alaia/animales/poster/` | Posters cuadrados extraídos del video. |
| `public/alaia/animales/audio/` | Audios finales (mono, 44.1 kHz, MP3 128 kbps). |
| `public/alaia/animales/signos/` | Signos LSE de la Fundación CNSE (960×480). |
| `public/alaia/animales/CREDITS.md` | Créditos generados; no se editan a mano. |
| `src/app/alaia/animales/` | Página, tarjetas, reproductor y página de créditos. |
| `src/lib/alaia-animals.test.ts` | Valida datos, créditos, rutas y límites de tamaño. |
| `src/app/alaia/animales/creditos/page.test.tsx` | Valida la página de créditos y sus enlaces. |

Si el encargo toca la interfaz (tarjetas, reproductor, página de créditos), lee `DESIGN.md` y respeta el sistema Crayon. No crees temas nuevos por perfil.

## Flujo de trabajo

### 1. Fija el criterio de aceptación

Traduce el encargo a condiciones comprobables antes de buscar nada. Por ejemplo:

- "La cabeza del caballo se ve entera durante todo el clip" → muestrear fotogramas al inicio, medio y final.
- "El cerdo suena amable" → elegir una vocalización suave, sin gruñidos agresivos ni ruido de manejo.
- "El loro no tiene tráfico de fondo" → comprobar el audio completo, no solo el primer segundo.
- "La cabra se ve de cuerpo entero" → encuadre que incluya patas y cabeza.

Si el criterio es ambiguo y la elección cambia mucho el resultado, pregunta antes de descargar. Si no, elige la opción más clara y amable y explica la decisión al final.

### 2. Mira el estado actual

```bash
git status --short
node -e "const d=require('./src/lib/alaia-animals.json'); console.log(JSON.stringify(d.find(a=>a.id==='gato'),null,2))"
```

Distingue los cambios propios de los que ya estaban en el árbol. No borres ni sobrescribas trabajo ajeno. No hagas commit salvo que se pida.

### 3. Busca una fuente válida

Lee `references/fuentes-medios.md`. Reglas cortas:

- Video: Pexels, con página, autor y licencia Pexels.
- Audio: Wikimedia Commons o Freesound; prioriza CC0 o dominio público.
- Signo: Fundación CNSE.
- Nunca inventes autor, licencia, URL ni página. Si no puedes verificar la licencia, esa fuente no sirve.

### 4. Valida la fuente antes de tocar el JSON

Descarga a `/tmp/alaia-<id>/` y comprueba dimensiones, duración y contenido. Para video, extrae una hoja de contacto de todo el clip; para audio, revisa duración, picos y silencios. Los comandos están en `references/procesamiento-medios.md`.

No edites el JSON ni borres el medio actual hasta tener una fuente que cumpla el criterio. Si la descarga falla, conserva lo que ya funciona.

### 5. Edita el JSON

Cada animal tiene esta forma (ejemplo abreviado):

```json
{
  "id": "caballo",
  "name": "Caballo",
  "sound": "¡Iiiih!",
  "article": "el",
  "category": "granja",
  "accent": "#F3E8D8",
  "video": "/alaia/animales/video/caballo.mp4",
  "poster": "/alaia/animales/poster/caballo.jpg",
  "audio": "/alaia/animales/audio/caballo.mp3",
  "sources": {
    "video": {
      "provider": "Pexels",
      "page": "https://www.pexels.com/video/...-32112347/",
      "author": "Christina & Peter",
      "license": "Pexels License",
      "downloadId": "32112347",
      "start": 0.3,
      "duration": 5,
      "crop": "crop=1080:1080:300:0"
    },
    "audio": {
      "provider": "Wikimedia Commons",
      "title": "File:Wiehern.ogg",
      "page": "https://commons.wikimedia.org/wiki/File:Wiehern.ogg",
      "author": "Hü.",
      "license": "Public domain",
      "downloadUrl": "https://upload.wikimedia.org/.../Wiehern.ogg.mp3",
      "start": 0,
      "duration": 6,
      "trimSilence": true
    }
  },
  "sign": {
    "image": "/alaia/animales/signos/caballo.jpg",
    "alt": "Signo de caballo en Lengua de Signos Española (LSE): ilustración del animal y secuencia del signo.",
    "source": {
      "provider": "Fundación CNSE · Mis primeros signos",
      "page": "https://www.fundacioncnse.org/educa/bancolse/animales-caballo.php",
      "author": "Fundación CNSE",
      "license": "CC BY-NC-SA 3.0",
      "downloadUrl": "https://www.fundacioncnse.org/.../caballo2-sinlogo.png"
    }
  }
}
```

Campos opcionales del audio:

| Campo | Efecto |
| --- | --- |
| `trimSilence` | Recorta el silencio inicial antes de normalizar. |
| `repeat` | Repite la llamada para que el clip no quede demasiado corto. |
| `gap` | Segundos entre repeticiones (por defecto 0.9). |
| `loudness` | Objetivo de loudness integrado; por defecto −16 LUFS. |
| `bass` | Refuerzo de graves en dB a 90 Hz; úsalo con moderación. |

### 6. Genera solo lo afectado

```bash
FFMPEG=/ruta/a/ffmpeg node scripts/build-alaia-media.mjs --force --only=caballo,gato
```

- `--only` acepta una lista separada por comas.
- Sin `--force`, el script conserva los archivos que ya existen.
- `--force` regenera **todo** lo del animal, incluido el signo. Si el signo no debía cambiar, revisa `git status` y restaura solo ese archivo:

```bash
git checkout -- public/alaia/animales/signos/caballo.jpg
```

- El script reescribe `CREDITS.md` con todos los animales aunque uses `--only`; asegúrate de que el JSON completo sea válido.

### 7. Verifica el resultado

```bash
node .agents/skills/alaia-animals/scripts/verify-media.mjs caballo,gato
node .agents/skills/alaia-animals/scripts/verify-media.mjs caballo --frames
```

El script comprueba tamaños, dimensiones, duración y nivel de audio, y con `--frames` deja una hoja de contacto en `/tmp/alaia-check/`. Ábrela con la herramienta de lectura de imágenes y revisa el clip completo, no solo el poster.

Criterios visuales:

- El animal se reconoce de inmediato y está centrado.
- Cabeza y cuerpo permanecen dentro del encuadre durante todo el clip (si el encargo lo pide, cuerpo entero).
- Sin marcas de agua, texto, personas dominando la escena ni cortes bruscos.
- Fondo limpio; el poster se lee bien en una tarjeta pequeña.

Criterios de audio:

- Una vocalización clara, sin música, voces, tráfico, viento ni ruido de manipulación.
- Sin clipping audible: para medios nuevos apunta a un pico de −1.5 dBTP; si un archivo existente marca 0.0 dB, revísalo antes de darlo por roto.
- Duración suficiente: una llamada natural de 2–6 s; si la fuente es más corta, usa `repeat`.
- Para rugidos o llamadas fuertes, sube `loudness` y usa `bass` con moderación; para sonidos suaves, no fuerces el volumen.
- Coherencia con el resto: compara la loudness integrada con los demás animales. Si tu audio queda más de 3 LU por debajo del más suave, comprueba que los sonidos activos se oigan en un móvil; no dejes un croac o un ladrido claro convertido en un susurro.

No puedes escuchar como una persona. Basa la decisión en la fuente, la forma de onda y los niveles; si el matiz es subjetivo y no hay forma de confirmarlo, dilo con honestidad y pide una escucha humana antes de afirmar que quedó perfecto.

### 8. Actualiza pruebas y créditos

- `public/alaia/animales/CREDITS.md` se genera solo. No lo edites.
- Si cambia el proveedor de audio, revisa el texto de la página de créditos y sus pruebas (`Wikimedia Commons y Freesound`).
- Actualiza `src/lib/alaia-animals.test.ts` cuando cambie una fuente elegida, un `downloadId`, un título de audio, `repeat` o `loudness`.
- Si agregas o quitas animales, actualiza los números y listas fijos:
  - `toHaveLength(22)` en `src/lib/alaia-animals.test.ts`.
  - La lista `animalNames` y `getAllByRole("heading", { level: 2 })` en `src/app/alaia/animales/creditos/page.test.tsx`.
  - `expect(externalLinks.length).toBe(66)` (3 enlaces por animal).
- Añade una prueba para la nueva funcionalidad o el nuevo medio, como exige `AGENTS.md`.

### 9. Cierra con verificación real

```bash
npx vitest run src/lib/alaia-animals.test.ts src/app/alaia/animales/creditos/page.test.tsx
npm test -- --run
npx tsc --noEmit
npm run lint
npm run build
```

Si hay servidor de desarrollo, comprueba la página y los medios:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/alaia/animales
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/alaia/animales/creditos
```

Si no hay servidor, arráncalo en segundo plano:

```bash
nohup npm run dev -- --hostname 0.0.0.0 --port 3000 > /tmp/solanozambrano-dev.log 2>&1 &
```

Informa la URL, el PID y la ruta del log. Si arrancaste un servidor solo para verificar, detállalo al terminar y comprueba que el puerto quedó libre; no dejes procesos `next` huérfanos.

## Tareas frecuentes

### Reemplazar un video

1. Busca un clip de Pexels con el animal claro y sin distracciones.
2. Comprueba dimensiones y duración; elige un segmento de 5 s sin cortes.
3. Calcula el recorte cuadrado para que el sujeto quede centrado y completo.
4. Descarga, recorta a `/tmp` y revisa una hoja de contacto de 10 fotogramas.
5. Actualiza `page`, `author`, `downloadId`, `start`, `duration` y `crop`.
6. Genera y verifica; revisa también el poster nuevo.

### Reemplazar un audio

1. Busca una vocalización aislada y amable; evita multitudes, música y ruido urbano.
2. Descarga el MP3 y revisa duración, picos y silencios.
3. Ajusta `start`, `duration`, `trimSilence`, `repeat`, `gap`, `loudness` y `bass` según haga falta.
4. Genera y compara niveles con el audio anterior: ni susurro ni saturación.
5. Actualiza la prueba del animal si cambió el título o el proveedor.

### Agregar un animal

1. Elige un `id` en minúsculas y sin acentos (`jirafa`, `camello`); el test exige `^[a-z]+$`.
2. Copia la estructura completa de un animal existente y rellena todos los campos.
3. Usa rutas derivadas del `id` para video, poster, audio y signo.
4. Busca el signo en la Fundación CNSE. Si no existe, no inventes uno: avisa y propone alternativas.
5. Inserta el animal cerca de otros de su categoría; el orden del array es el orden de la cuadrícula.
6. Genera sus medios, actualiza los conteos y listas de las pruebas, y añade créditos.
7. Elige un `accent` de la paleta de `DESIGN.md`; no introduzcas colores nuevos.

### Quitar un animal

1. Confirma con la persona usuaria antes de borrar archivos.
2. Quita la entrada del JSON y actualiza conteos, listas y pruebas.
3. Borra sus medios solo si se confirmó; si no, deja los archivos y explica.
4. Comprueba que ninguna página, prueba o crédito lo siga mencionando.

### Cambiar textos o datos de presentación

`name`, `sound`, `article` y `category` se usan en la tarjeta y el reproductor. Mantén el tono cálido y claro. `sound` es una onomatopeya breve en español. Si cambias un nombre, actualiza las pruebas que lo buscan.

### Auditar la app

Ejecuta `verify-media.mjs` sin argumentos y las pruebas. Revisa:

- archivos faltantes o por encima de los límites;
- videos que no sean 720×720 o que tengan duración rara;
- audios con picos altos, silencios o duración insuficiente;
- posters y signos con dimensiones incorrectas;
- créditos sin autor, licencia o página.

Para una revisión completa antes de enseñar la app (decodificación, fotogramas negros, póster contra video, true peak, loudness, hashes y correspondencia con la fuente), sigue `references/auditoria.md`. Separa los problemas bloqueantes de los matices de calidad y no modifiques nada si el encargo es solo auditar.

## Límites y errores comunes

- **Pexels devuelve 403 en la página**: usa `https://r.jina.ai/` para leer metadatos y el endpoint `https://www.pexels.com/download/video/<id>/` con un User-Agent de navegador para descargar.
- **Wikimedia devuelve 429**: espera y reintenta; no borres el audio actual hasta que la nueva descarga funcione.
- **Freesound**: la página puede requerir JavaScript; usa el preview de `cdn.freesound.org` y verifica autor y licencia en la ficha.
- **`--force` toca los signos**: restaura los que no cambiaron para no ensuciar el diff.
- **El crop se sale del cuadro**: calcula con las dimensiones reales de `ffprobe`; para 1920×1080 un cuadrado válido es 1080×1080.
- **El video se ve bien en el poster pero mal en movimiento**: muestrea todo el clip; el poster se extrae a los 0.6 s.
- **El audio queda demasiado corto**: usa `repeat` y `gap` en lugar de estirar o repetir a mano el archivo.
- **El audio satura**: baja `loudness` o reduce `bass`; el script aplica un limitador, pero conviene revisar el pico.
- **Falta ffmpeg**: revisa `references/procesamiento-medios.md` para localizar o descargar un binario estático.
- **Cambió el número de animales**: actualiza todas las expectativas fijas; si no, las pruebas fallan aunque la app funcione.
- **No cambies `CREDITS.md` a mano**: se regenera en cada build.
- **No uses texto o audio que pueda asustar a una niña**: nada de rugidos distorsionados, gruñidos agresivos ni palabras inapropiadas.

## Definición de terminado

- [ ] El JSON es válido y el animal tiene todos los campos.
- [ ] Video 720×720, H.264, ~5 s, menos de 2 MB.
- [ ] Poster cuadrado, menos de 300 KB, con el animal reconocible.
- [ ] Audio mono 44.1 kHz, MP3 128 kbps, menos de 500 KB, sin clipping.
- [ ] Signo 960×480, menos de 250 KB, con texto alternativo correcto.
- [ ] Revisión visual de todo el clip, no solo del poster.
- [ ] Créditos y licencias verificados; `CREDITS.md` regenerado.
- [ ] Pruebas actualizadas y pasando; `tsc`, lint y build correctos.
- [ ] Página y medios responden en el servidor de desarrollo.
- [ ] Diff limpio: sin archivos generados o signos que no tocaban.

## Referencias

- `references/fuentes-medios.md` — dónde buscar videos, audios y signos, y cómo verificar licencias.
- `references/procesamiento-medios.md` — ffmpeg, recortes, audio y comprobaciones.
- `references/auditoria.md` — revisión profunda de todos los medios y plantilla de informe.
- `scripts/verify-media.mjs` — informe de tamaños, dimensiones, duración y niveles.