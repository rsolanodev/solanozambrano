## Context

Ver `proposal.md` para la motivación y `specs/` para el contrato de comportamiento.

Estado actual relevante:

- Alaia ya existe en `src/lib/profiles.ts`, pero sin `href`, sin tema propio y sin `DESIGN_ALAIA.md`; el selector la muestra como "Próximamente".
- Albany establece el patrón de perfil: `/albany` como launcher, ruta hija para la app, tema con `data-profile-theme` y documento `DESIGN_<PERFIL>.md` antes de tocar UI.
- `src/styles/profile-themes.css` solo define los temas `family` y `albany`.
- No hay infraestructura de medios: `public/` solo contiene los SVG de ejemplo. No hay `ffmpeg` ni `sharp` instalados en el entorno de desarrollo.
- El proyecto usa Next.js 16 (App Router), React 19, Tailwind 4, Vitest + React Testing Library y `fake-indexeddb`. `AGENTS.md` exige tests para cada funcionalidad nueva.
- El target principal es un móvil o tablet con Safari/Chrome moderno; la experiencia debe funcionar con toques grandes y poco texto.

## Goals / Non-Goals

**Goals:**

- Entregar una experiencia de causa-efecto inmediata: tocar un animal → ver video real en loop + escuchar su sonido.
- Mantener los medios locales y optimizados para que la app no dependa de Pexels/Wikimedia en runtime.
- Soportar el crecimiento del catálogo sin reescribir la cuadrícula ni el reproductor.
- Resolver el autoplay de audio en iOS sin depender de `useEffect` ni de reproducción silenciosa.
- Cumplir el contrato de diseño por perfil del repositorio y la obligación de tests.

**Non-Goals:**

- Cuentas, backend, base de datos, analítica o sincronización.
- Favoritos, quiz "adivina el sonido", grabación de voz, realidad aumentada o más apps para Alaia en esta entrega.
- PWA con service worker y funcionamiento offline de la página completa (los medios sí son locales).
- Video a pantalla completa, video con audio sincronizado o streaming remoto.
- Internacionalización; todo el copy va en español.
- Panel parental, control de volumen o ajustes persistentes.

## Decisions

### 1. Rutas y composición

- `/alaia`: launcher "Mundo de Alaia" con una única tarjeta grande de Animales.
- `/alaia/animales`: cuadrícula + reproductor como estado interno (`openIndex`), no como ruta por animal.
- `/alaia/animales/creditos`: página de créditos para adultos.
- `src/app/alaia/layout.tsx` envuelve todo el árbol con `data-profile-theme="alaia"`.

**Por qué:** el launcher fue la opción elegida y deja espacio a futuras apps; mantener el reproductor como estado conserva la posición de scroll de la cuadrícula y permite transiciones inmediatas. Una ruta por animal añadiría carga de página y complejidad de navegación sin beneficio para 1-3 años.

**Alternativas descartadas:** perfil → animales directo (menos toques, pero sin espacio para más apps); rutas `/alaia/animales/[id]` (más profundo, pero más lento y con más estados de carga).

### 2. Video en loop mudo + audio separado

- Cada animal tiene un MP4 H.264 720×720 sin pista de audio, un poster JPG del primer frame y un MP3 mono normalizado.
- El `<video>` usa `autoPlay`, `muted`, `loop`, `playsInline` y `poster`.
- El audio vive en un único `<audio>` persistente en la página, fuera del reproductor visual.
- Al tocar una tarjeta se asigna `src`, se resetea `currentTime` y se llama `play()` dentro del handler del evento.
- "Otra vez" y el toque sobre el video repiten el audio; el video no se reinicia.
- Al cerrar se pausa el audio y se desmonta el video.

**Por qué:** el video mudo autoplay es fiable en iOS/Android; el audio separado permite repetirlo sin reiniciar la animación y evita que el loop arrastre un audio desincronizado. También permite usar videos de stock sin audio y audios reales de otra fuente.

**Alternativas descartadas:** video con audio propio (más difícil de repetir y de autoplay en iOS); autoplay de audio en `useEffect` (Safari lo bloquea); video remoto (dependencia de red y de URLs de terceros).

### 3. Formato cuadrado 1:1

- El video y el poster se recortan a 720×720.
- La cuadrícula usa posters cuadrados y el reproductor una tarjeta de video cuadrada grande, no pantalla completa.
- El recorte se define por animal en el manifiesto (`crop`) y se revisa visualmente frame a frame.

**Por qué:** un cuadrado funciona igual en móvil vertical, tablet y desktop, evita recortes agresivos de videos 16:9 o 9:16 y deja sitio para nombre, onomatopeya y controles. La pantalla completa obligaría a recortar mucho o a dejar barras.

**Alternativas descartadas:** full-bleed 9:16 (más inmersivo, pero requiere fuentes verticales y recorta a los animales); `object-contain` con fondo desenfocado (más ruido visual y menos sensación de app).

### 4. Fuente única de datos

`src/lib/alaia-animals.json` contiene, por animal:

- `id`, `name`, `sound`, `article`, `category`, `accent`.
- `video`, `poster`, `audio` (rutas locales).
- `sources.video` y `sources.audio` con proveedor, página, autor, licencia y metadatos de corte (`start`, `duration`, `crop`).

`src/lib/alaia-animals.ts` importa el JSON, lo tipa y exporta `alaiaAnimals`. El script de medios lee el mismo JSON para descargar y recortar.

**Por qué:** evita duplicar rutas y créditos entre la app, los tests y el script; añadir un animal es añadir una entrada y tres archivos. El JSON es pequeño y se puede importar tanto en cliente como en servidor.

**Alternativas descartadas:** array TS + manifiesto separado (duplicación y riesgo de desincronización); base de datos (innecesaria para 12 elementos estáticos).

### 5. Pipeline de medios

1. Descargar el video original de Pexels con un `User-Agent` de navegador.
2. Recortar/redimensionar con `ffmpeg`: `crop` → `scale=720:720`, 30 fps, H.264, `-crf 28`, `-pix_fmt yuv420p`, `-movflags +faststart`, `-an`.
3. Extraer el poster en JPG desde el video final.
4. Descargar el MP3 derivado de Wikimedia Commons (`prop=videoinfo`, `derivatives` con `transcodekey=mp3`).
5. Normalizar el audio a `-16 LUFS` (`loudnorm=I=-16:TP=-1.5:LRA=11`), mono 44.1 kHz, 128 kbps, con fades; repetir el grunt del cerdo si hace falta.
6. Guardar todo en `public/alaia/animales/{video,poster,audio}/`.

**Por qué:** los assets finales pesan ~8 MB, se sirven estáticos y no requieren ffmpeg en producción. El script queda para mantener el catálogo. En este entorno se usa un binario estático temporal de ffmpeg; no se añade como dependencia de runtime.

**Alternativas descartadas:** `ffmpeg-static` como devDependency (80 MB extra y postinstall frágil en CI); video remoto (latencia y fragilidad); audio generado por TTS (no es el sonido real del animal).

### 6. Reproductor y accesibilidad

- El reproductor es un overlay `fixed inset-0` con `role="dialog"`, `aria-modal="true"` y etiqueta con nombre + onomatopeya.
- Foco inicial en el botón de cerrar; trampa de foco manual; `inert`/`aria-hidden` en la cuadrícula de fondo; al cerrar se restaura el foco a la tarjeta de origen.
- Escape, botón de cerrar y botón atrás del navegador cierran.
- Flechas izquierda/derecha del teclado cambian de animal; Espacio repite el sonido.
- El contador "N de 12" usa `aria-live="polite"`.
- `prefers-reduced-motion: reduce` muestra el poster y no autoplay el video; el audio sigue disponible.

**Por qué:** el público objetivo no lee, pero los adultos y lectores de pantalla sí necesitan estructura. El diálogo modal y la restauración de foco son el mínimo para no perder a un usuario de teclado o lector de pantalla.

**Alternativas descartadas:** `<dialog>` nativo (focus trap y Escape gratis, pero `showModal` no está implementado en jsdom y complica los tests); overlay sin trampa de foco (el fondo queda accesible).

### 7. Historial y botón atrás

- Al abrir: `history.pushState({ alaiaPlayer: true }, "", "#<animal>")`.
- Al cambiar de animal: `history.replaceState(..., "#<animal>")`.
- Al cerrar: si el estado actual es del reproductor, `history.back()`; un listener de `popstate` cierra el reproductor y restaura el foco.
- Si el reproductor se abrió sin entrada de historial propia, se cierra directamente y se limpia el hash.

**Por qué:** en Android el gesto/botón atrás es natural; sin esto, abandonaría la app. El hash también permite recargar sin perder el contexto visual (aunque no se abre el reproductor automáticamente desde un deep link en esta entrega).

**Riesgo:** Next.js también escucha `popstate`; se probará que el router no navegue fuera de `/alaia/animales`. Si hay conflicto, se degrada a cierre con ✕/Escape y se documenta.

### 8. Cuadrícula y rendimiento

- 2 columnas en móvil, 3 en tablet y 4 en desktop; `max-width` centrado y gaps generosos.
- Solo posters en la cuadrícula; los videos no se cargan hasta abrir el reproductor.
- Posters con `<img>` nativo, `loading="lazy"` (salvo los 4 primeros), `decoding="async"`, `width=720 height=720`; son decorativos (`alt=""`) porque el botón ya tiene nombre accesible.
- No se precargan los 12 audios; se cargan al seleccionar. Los MP3 son pequeños (~40-80 KB).

**Por qué:** 12 videos autoplay simultáneos serían pesados y sobreestimulantes. Los posters pre-optimizados hacen innecesaria la optimización de imágenes en runtime; se usa `<img>` nativo para evitar dependencias y configurar `next/image` solo para este caso.

### 9. Créditos y licencias

- `sources` incluye video y audio con autor, licencia y URL de la página original.
- `/alaia/animales/creditos` renderiza una lista por animal con enlaces externos `target="_blank"` y `rel="noreferrer"`, identificados como externos.
- Se prefieren audios CC0/dominio público; si se usa CC BY/CC BY-SA se muestra atribución y licencia. Los videos de Pexels se acreditan igualmente aunque su licencia no lo exija.

**Por qué:** es la forma de cumplir las licencias de Wikimedia y de dejar trazabilidad para futuras sustituciones de medios.

### 10. Tests

- `alaia-animals.test.ts`: 12 entradas, IDs únicos, campos completos, créditos, formatos y existencia/tamaño de los 36 assets.
- `alaia/page.test.tsx` y `layout.test.tsx`: launcher, enlace a Animales, vuelta a perfiles, tema.
- `animales/page.test.tsx`: 12 tarjetas, nombres accesibles, apertura, play de audio, repetir, siguiente/anterior circular, cierre, foco, Escape, errores, reducción de movimiento, botón atrás.
- `creditos/page.test.tsx`: 12 animales, fuentes, autores y licencias.
- `src/app/page.test.tsx`: Alaia deja de ser "Próximamente" y enlaza a `/alaia`.
- Mocks de `HTMLMediaElement.play/pause`, `matchMedia` e `history` en el setup o en cada test.

## Risks / Trade-offs

- **No se puede validar subjetivamente el audio** → se eligen archivos con descripciones explícitas y licencia clara, se normaliza el volumen y se pide una escucha humana antes de cerrar.
- **El recorte cuadrado puede cortar al animal** → se extraen frames de cada video y se ajusta `crop` por animal; se revisan los 12 posters.
- **El loop puede tener un salto visible** → se eligen segmentos con movimiento continuo y se revisan los 12 videos en el navegador.
- **Autoplay de audio bloqueado en iOS** → `<audio>` persistente + `play()` dentro del gesto + estado de reintento visible.
- **Conflicto de `popstate` con Next.js** → test específico; si falla, se mantiene el cierre con ✕/Escape y se documenta la limitación.
- **Peso del repositorio** → límites de tamaño en tests (< 2 MB video, < 300 KB poster, < 500 KB audio); total estimado ~8 MB.
- **Licencias CC BY-SA** → página de créditos con autor, licencia y enlace; preferencia por CC0/PD.
- **La página no funciona offline sin PWA** → los medios son locales, pero el HTML/JS requiere host; se deja PWA como no-goal.
- **Atracones de toques en 1-3 años** → botones grandes, sin acciones destructivas, cierre claro y sin menús.
- **Assets de stock con animales distintos al sonido** → se elige una especie coherente por animal (p. ej., chimpancé para el mono) y se revisa visualmente.

## Migration Plan

- No hay migración de datos ni cambios de API.
- Desplegar es aditivo: nuevas rutas y assets; el perfil de Alaia pasa de "Próximamente" a enlace.
- Rollback: revertir `profiles.ts` a sin `href`, eliminar las rutas `/alaia/**` y los assets; el resto del proyecto no se ve afectado.
- Verificación post-deploy: `/`, `/alaia`, `/alaia/animales`, abrir los 12 animales, cerrar, siguiente/anterior, créditos y una prueba en móvil real.

## Open Questions

- ¿Añadir una voz en español que diga el nombre del animal antes del sonido? Se deja para una segunda fase; no cambia la arquitectura.
- ¿Convertir la app en PWA instalable con cache offline? Se deja para una segunda fase; los medios ya son locales.
- ¿Añadir un modo "adivina el sonido" para cuando Alaia sea mayor? Fuera del alcance de 1-3 años.
