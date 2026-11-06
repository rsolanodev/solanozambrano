## Why

Alaia todavía no tiene un espacio propio: su perfil aparece como "Próximamente" y no existe una ruta ni un tema visual para ella. La familia quiere una app muy sencilla, segura y adecuada para 1-3 años donde Alaia pueda ver animales reales, escuchar sus sonidos y repetirlos tantas veces como quiera, sin menús complejos ni dependencia de internet para los medios.

## What Changes

- Activar el perfil de Alaia con un tema visual propio (lavanda/morado), una ruta `/alaia` y un launcher llamado "Mundo de Alaia".
- Añadir la app "Animales" en `/alaia/animales` con 12 animales iniciales: vaca, oveja, caballo, cerdo, gallo, pato, perro, gato, león, elefante, mono y rana.
- Crear una cuadrícula de tarjetas grandes (2 columnas en móvil, 3-4 en tablet) con poster realista, nombre, onomatopeya y una señal visual de sonido.
- Crear un reproductor a pantalla completa con video real en loop (cuadrado, mudo), audio real del animal, botón gigante para repetir, navegación anterior/siguiente, cierre grande y estados de error.
- Reproducir el sonido al abrir el reproductor y permitir repetirlo sin reiniciar el video; el video sigue en loop aunque el audio termine.
- Guardar los medios optimizados en local: MP4 H.264 720×720 sin audio, poster JPG y MP3 mono normalizado, con un total estimado de ~8 MB.
- Documentar y mostrar los créditos de videos y audios en `/alaia/animales/creditos`.
- Hacer el catálogo data-driven para que añadir un animal nuevo sea añadir datos y medios, no reescribir la UI.
- Añadir pruebas unitarias, de componentes e integración para catálogo, assets, cuadrícula, reproductor, foco, errores y launcher.
- Respetar `prefers-reduced-motion` mostrando el poster estático en lugar del video, sin perder el audio.

## Capabilities

### New Capabilities

- `alaia-profile`: acceso al perfil de Alaia desde el selector familiar, tema visual propio y launcher "Mundo de Alaia" con la app Animales.
- `alaia-animal-sounds`: catálogo de 12 animales, cuadrícula táctil, reproductor de video en loop con audio real, navegación, fallbacks, accesibilidad y créditos de medios.

### Modified Capabilities

- Ninguna. No existen specs previas en `openspec/specs/`.

## Impact

- Rutas nuevas: `/alaia`, `/alaia/animales`, `/alaia/animales/creditos`.
- Código afectado: `src/lib/profiles.ts`, `src/app/page.tsx` (test), `src/app/alaia/**`, `src/lib/alaia-apps.ts`, `src/lib/alaia-animals.ts`, `src/lib/alaia-animals.json`, `src/styles/profile-themes.css`.
- Documentación: `DESIGN_ALAIA.md` (nuevo) y mapa de `DESIGN.md`.
- Assets nuevos en `public/alaia/animales/{video,poster,audio}/` (~8 MB) y script de regeneración `scripts/build-alaia-media.mjs`.
- Tests: `src/app/page.test.tsx` cambia porque Alaia deja de estar pendiente; se añaden tests de layout, launcher, catálogo, assets, cuadrícula, reproductor y créditos.
- Sin cambios de API, backend, base de datos ni dependencias de runtime. Los medios se sirven localmente desde `public/`.
