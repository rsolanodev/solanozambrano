# SolanoZambrano · Guía de desarrollo

Guía de referencia para trabajar en **SolanoZambrano**, la web familiar de los Solano Zambrano. Reúne un selector de perfiles y un espacio propio para cada miembro de la familia. El tono es cálido y cuidado; la interfaz es Mobile-First y visual.

Estado actual: solo el espacio de **Alaia** está construido (`/alaia` y su app de animales). Los demás perfiles aparecen como “Muy pronto”.

---

## La familia y para quién es cada perfil

| Perfil | Quién es | Estado |
| --- | --- | --- |
| **Albany** | 25 años. Madre de Alaia y Lucía. | Pendiente |
| **Rubén** | 26 años. Padre de Alaia y Lucía. | Pendiente |
| **Alaia** | Hija. Es sorda y en casa todos estamos aprendiendo LSE. | Activo: `/alaia` |
| **Lucía** | Hija de Albany y Rubén, hermana de Alaia. | Pendiente |
| **Coco** | El perro de la familia: un cavalier king Charles spaniel. | Pendiente |

Cómo leer la tabla:

- **Albany y Rubén** son las personas adultas que usan la app. Sus espacios deben ser rápidos, legibles y tranquilos; nada infantilizado.
- **Alaia** es la usuaria del espacio infantil. Su sordera no es un detalle: condiciona cómo se presenta cada contenido.
- **Lucía** es hija de Albany y Rubén. Su espacio está por definir; antes de diseñarlo, pregunta qué necesita.
- **Coco** no navega solo. Su perfil es un guiño familiar: trátalo con cariño y humor, sin fingir que es un usuario real.

### Alaia y la Lengua de Signos Española (LSE)

- Alaia es sorda; la LSE es parte central de su espacio, no decoración.
- Cada animal incluye el signo de la Fundación CNSE y se abre con “Ver signo LSE”.
- Ningún contenido debe depender solo del sonido: si algo se explica con audio, debe tener equivalente visual (imagen, signo, texto o estado visible).
- El audio nunca suena sin un toque. El vídeo va mudo y en bucle.
- La familia está aprendiendo LSE: mantén el vocabulario visible y correcto, usa “LSE” (no “lenguaje de señas”) y no inventes signos. Si un signo no existe en la fuente CNSE, avisa y propón alternativas.
- Conserva la atribución y la licencia CC BY-NC-SA de los signos en `/alaia/animales/creditos`.

---

## Pruebas (obligatorio)

- Cada funcionalidad nueva lleva prueba unitaria o de integración. Aplica a componentes, estado, validación, catálogo y utilidades.
- Vitest + React Testing Library sobre jsdom. Renderiza con `render` de `@/lib/test-utils` para tener el `MantineProvider`.
- Los mocks globales de `play` / `pause` / `load` y `matchMedia` viven en `src/lib/test-setup.ts`; amplía ahí si hace falta.
- Coloca el test junto al archivo que prueba (`page.test.tsx`, `layout.test.tsx`, `*.test.ts`).
- No cierres una tarea sin `npm test` en verde. Antes de entregar, pasa también `npm run lint`, `npx tsc --noEmit` y `npm run build`.

---

## Diseño

- Lee `DESIGN.md` antes de tocar cualquier pantalla. Es la fuente única del sistema Crayon: paleta, Averia Libre + Nunito, radios, sombras, componentes, movimiento y accesibilidad.
- Para el espacio de Alaia, lee además `DESIGN_ALAIA.md`: reglas de la etapa 1-3 años, launcher, tarjetas, reproductor, signos y créditos.
- No hay temas por perfil: todos comparten el mismo sistema. El perfil solo cambia nombre, icono, acento de la paleta y contenido. No reintroduzcas `data-profile-theme` ni paletas alternativas.
- Mobile-First. Objetivos táctiles de 44 px mínimo (56-64 px en acciones principales), foco visible, contraste AA y respeto a `prefers-reduced-motion`.
- Textos en español de España, tuteo cálido y frases breves. Sin emojis en la UI: usa los doodles del sistema.

---

## Rutas y estado

| Ruta | Pantalla | Estado |
| --- | --- | --- |
| `/` | Selector familiar (5 perfiles) | Activo |
| `/alaia` | Launcher “Mundo de Alaia” | Activo |
| `/alaia/animales` | Cuadrícula de 22 animales | Activo |
| `/alaia/animales/creditos` | Fuentes y licencias | Activo |

El catálogo tiene 22 animales: 9 de granja, 4 mascotas y 9 salvajes.

---

## Arquitectura

- `src/lib/profiles.ts`: fuente de verdad de los perfiles. Añade `href` solo cuando la ruta exista; sin `href`, la tarjeta se muestra deshabilitada como “Muy pronto”.
- `src/lib/alaia-apps.ts`: apps del launcher de Alaia.
- `src/lib/alaia-animals.json`: fuente de verdad de animales, medios y créditos. `alaia-animals.ts` expone los tipos y helpers.
- `src/app`: rutas del App Router. Cada pantalla tiene su CSS Module al lado.
- `src/components`: piezas compartidas (`BrandMark`, `BackButton`, `Marker`, `PageDoodles`, `CrayonDoodles`).
- `src/theme.ts` y `src/styles/design-tokens.css`: tema Mantine y tokens CSS. No dupliques valores fuera de ahí.
- `scripts/build-alaia-media.mjs`: genera vídeos, pósters, audios, signos y `CREDITS.md` a partir del JSON.

### Medios de animales

No edites a mano `public/alaia/animales/**` ni `CREDITS.md`: se regeneran. El flujo completo (fuentes válidas, recorte, normalización, verificación y pruebas) está en la skill `.agents/skills/alaia-animals/SKILL.md`; cárgala siempre que toques animales o medios. Para comprobar el resultado:

```bash
node .agents/skills/alaia-animals/scripts/verify-media.mjs
```

---

## Cambios y documentación

- Los cambios de producto se planifican en `openspec/changes/<cambio>/` con `proposal.md`, `design.md` y `tasks.md`; las specs viven en `openspec/specs/`.
- Hay un cambio abierto, `add-alaia-animal-sounds`, con una tarea pendiente de revisión humana del audio (8.7).
- Si añades una pantalla o un perfil, actualiza el mapa de `DESIGN.md` y esta guía.

---

## Comandos

```bash
npm run dev        # Next.js en http://localhost:3000
npm test           # Vitest
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript
npm run build      # Build de producción
```

---

## Estado pendiente

- Activar los espacios de Albany, Rubén, Lucía y Coco. Cada uno necesita su ruta, su objetivo y sus pruebas antes de añadir `href`.
- Los metadatos raíz (`src/app/layout.tsx` y `src/app/layout.test.tsx`) todavía anuncian “Calendario de Tensión” y embarazo, herencia de la versión anterior. Deben pasar a describir el hub familiar.
- `README.md` está vacío.
