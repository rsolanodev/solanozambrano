## 1. Diseño y tema de Alaia

- [x] 1.1 Crear `DESIGN_ALAIA.md` con paleta lavanda/morada, tipografía, radios, espaciados, componentes (app tile, animal card, player, sound button), movimiento y reglas para 1-3 años.
- [x] 1.2 Añadir el bloque `[data-profile-theme="alaia"]` en `src/styles/profile-themes.css` con los tokens definidos y una utilidad `text-display` en `src/app/globals.css` si el reproductor la necesita.
- [x] 1.3 Actualizar la tabla de `DESIGN.md` con las rutas `/alaia`, `/alaia/animales`, el documento `DESIGN_ALAIA.md` y el tema `alaia`.

## 2. Perfil y launcher

- [x] 2.1 Activar Alaia en `src/lib/profiles.ts` con `href: "/alaia"` y actualizar `src/app/page.test.tsx` para que espere un enlace (no "Próximamente").
- [x] 2.2 Crear `src/app/alaia/layout.tsx` con `data-profile-theme="alaia"`, metadata "Mundo de Alaia" y su test de layout.
- [x] 2.3 Crear `src/lib/alaia-apps.ts` con la app Animales (nombre, ruta, descripción) y un icono SVG propio (elefante con ondas de sonido).
- [x] 2.4 Crear `src/app/alaia/page.tsx` como launcher "Mundo de Alaia" con una tarjeta grande de Animales, enlace de vuelta a `/` y su test.

## 3. Catálogo de animales

- [x] 3.1 Crear `src/lib/alaia-animals.json` con los 12 animales (vaca, oveja, caballo, cerdo, gallo, pato, perro, gato, león, elefante, mono, rana), incluyendo id, nombre, onomatopeya, artículo, categoría, acento, rutas de medios y créditos.
- [x] 3.2 Crear `src/lib/alaia-animals.ts` con el tipo `Animal`, la importación tipada del JSON y helpers (`alaiaAnimals`, total, búsqueda por id).
- [x] 3.3 Crear `src/lib/alaia-animals.test.ts` para validar 12 entradas, IDs únicos, campos completos y créditos de video/audio.

## 4. Medios locales

- [x] 4.1 Crear `scripts/build-alaia-media.mjs`: leer el JSON, descargar videos de Pexels con User-Agent, recortar/redimensionar con ffmpeg (720×720, 5 s, H.264, sin audio, faststart), extraer poster JPG y descargar/normalizar audios de Wikimedia (MP3, mono, `loudnorm`, fades). Soportar `FFMPEG`/`--force`.
- [x] 4.2 Curar y registrar los 12 videos de Pexels: vaca 36421194, oveja 29711035, caballo 29120466, cerdo 30158235, gallo 36177845, pato 10767951, perro 7516718, gato 6000759, león 10418864, elefante 855538, mono 26077636, rana 34608782 (ajustar si el frame no es bueno).
- [x] 4.3 Curar y registrar los 12 audios de Wikimedia: vaca `Mudchute cow 1.ogg`, oveja `Sheep bleating.ogg`, caballo `Wiehern.ogg`, cerdo `Pig grunt - Erdie.ogg` (repetir 3 veces), gallo `Small rooster crowing.ogg`, pato `Anas platyrhynchos - Mallard - XC62258.ogg`, perro `Perro ladrando.ogg`, gato `Meow of a Siamese cat - freemaster2.wav`, león `Lion raring-sound1TamilNadu178.ogg`, elefante `Elephant voice - trumpeting.ogg`, mono `Pant-hoot call made by a male chimpanzee.ogg`, rana `Wood Frogs calling in spring.ogg`.
- [x] 4.4 Ejecutar el script, revisar los 12 posters/frames, ajustar `crop`/`start`/`duration` y verificar que los videos hacen loop sin saltos evidentes.
- [x] 4.5 Verificar los 36 assets: formato correcto y límites (< 2 MB video, < 300 KB poster, < 500 KB audio); crear `public/alaia/animales/CREDITS.md` con fuentes y licencias.
- [x] 4.6 Completar `src/lib/alaia-animals.test.ts` con existencia, formato y tamaño de cada asset local.

## 5. Cuadrícula

- [x] 5.1 Crear `src/app/alaia/animales/page.tsx` como client component con cabecera, enlace de vuelta a `/alaia`, cuadrícula de 12 animales, `<audio>` persistente y estado `openIndex`.
- [x] 5.2 Crear `AnimalCard.tsx` con poster nativo (`loading="lazy"`, `decoding="async"`, `alt=""`), nombre, onomatopeya, badge de sonido y nombre accesible "Escuchar a la/el …".
- [x] 5.3 Aplicar el layout responsive (2 columnas móvil, 3 tablet, 4 desktop), áreas seguras y objetivos táctiles grandes.
- [x] 5.4 Añadir tests de cuadrícula: 12 tarjetas, nombres accesibles, foco con Tab, apertura con Enter/Espacio.

## 6. Reproductor

- [x] 6.1 Crear `AnimalPlayer.tsx` con overlay `role="dialog"`, `aria-modal`, video, nombre, onomatopeya, contador "N de 12" con `aria-live="polite"`, botón "Otra vez", anterior/siguiente, cerrar y barras de sonido.
- [x] 6.2 Implementar la orquestación de audio en la página: asignar `src`, resetear `currentTime`, `play()` dentro del handler, estados `idle/playing/error`, pausa al cerrar y reproducción al cambiar de animal.
- [x] 6.3 Implementar el video: `autoPlay`, `muted`, `loop`, `playsInline`, `poster`, fallback a poster si falla y hook de `prefers-reduced-motion` para mostrar solo el poster.
- [x] 6.4 Implementar foco y teclado: foco inicial en cerrar, trampa de foco, `inert` en el fondo, Escape, flechas para navegar, Espacio para repetir, bloqueo de scroll y restauración del foco.
- [x] 6.5 Implementar historial: `pushState` al abrir, `replaceState` al cambiar, `popstate` para cerrar con el botón atrás y limpieza del hash al cerrar.
- [x] 6.6 Implementar estados de error: audio con "Toca para escuchar" y reintento; video con poster de respaldo.
- [x] 6.7 Añadir tests del reproductor: abrir/reproducir, no autoplay al cargar, repetir sin reiniciar video, siguiente/anterior circular, cerrar/pausar/restaurar foco, Escape, atrás, errores, reducción de movimiento y atributos del diálogo.
- [x] 6.8 Pulir transiciones, barras de sonido, layout vertical/landscape y áreas seguras.

## 7. Créditos

- [x] 7.1 Crear `src/app/alaia/animales/creditos/page.tsx` con los 12 animales, fuente, autor, licencia y enlaces externos identificados (`target="_blank"`, `rel="noreferrer"`).
- [x] 7.2 Añadir un enlace discreto a "Créditos" en el pie de la cuadrícula y/o en el launcher.
- [x] 7.3 Añadir tests de la página de créditos y del enlace desde la cuadrícula.

## 8. Calidad y validación

- [x] 8.1 Añadir mocks de `HTMLMediaElement.play/pause`, `matchMedia` e historial en `src/lib/test-setup.ts` o en los tests que los necesiten.
- [x] 8.2 Ejecutar `npm test` y corregir todos los fallos.
- [x] 8.3 Ejecutar `npm run lint` y corregir avisos/errores.
- [x] 8.4 Ejecutar `npm run build` y verificar que las rutas y assets se generan correctamente.
- [x] 8.5 Levantar el servidor de desarrollo y probar `/`, `/alaia`, `/alaia/animales`, los 12 animales, siguiente/anterior, cerrar, créditos y viewport móvil.
- [x] 8.6 Verificar en la pestaña Network que ningún video, poster o audio se solicita a un dominio externo, y que el flujo principal no carga analítica ni enlaces externos.
- [ ] 8.7 Pedir a la persona usuaria que escuche los 12 audios y ajustar volumen/fuente si alguno no convence.
