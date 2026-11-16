# SolanoZambrano · Sistema de Diseño Crayon

Guía visual única para **todo el repositorio**. Sustituye los temas por perfil:
todas las pantallas comparten paleta, tipografía, formas, componentes y reglas de
accesibilidad. Los perfiles familiares solo cambian su nombre, su icono y el
contenido, nunca el tema visual.

La dirección creativa está inspirada en la energía de las guías de marca infantiles
tipo *Crayon Curves*: papel cálido, morado profundo, trazos de crayón, formas
orgánicas y acentos muy vivos. La implementación, los textos y los recursos son
propios del proyecto.

---

## 1. Principios

1. **Cálido y juguetón, nunca infantilizado.** La app la usa una familia real:
   debe sentirse alegre, pero clara y rápida.
2. **Un solo sistema.** Un único tema global. No hay colores ni tipografías por
   perfil.
3. **Formas suaves, bordes claros.** Tarjetas redondeadas, trazos gruesos y
   sombras de sticker. Nada de esquinas duras ni degradados complejos.
4. **Una acción principal por pantalla.** Botones grandes, jerarquía evidente.
5. **Accesible por defecto.** Contraste AA, foco visible, objetivos táctiles de
   44 px mínimo y respeto a `prefers-reduced-motion`.
6. **El color comunica, no decora porque sí.** Coral = acción; sol = atención;
   verde = correcto; azul = información.

---

## 2. Paleta

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-canvas` | `#FBF6E6` | Fondo general de la app. |
| `--color-paper` | `#FFFDF7` | Superficies, tarjetas, botones secundarios. |
| `--color-ink` | `#5D0045` | Texto principal, títulos, bordes activos. |
| `--color-ink-soft` | `#7E4B70` | Texto secundario, metadatos, descripciones. |
| `--color-coral` | `#FF5833` | Acento de marca, doodles, formas grandes. |
| `--color-coral-strong` | `#C23616` | Acción primaria, enlaces, botones con texto pequeño. |
| `--color-coral-dark` | `#A82C0F` | Hover de la acción primaria. |
| `--color-coral-soft` | `#FFE3DA` | Fondos suaves, badges y escenarios. |
| `--color-sun` | `#FFCA24` | Subrayados tipo crayón, estrellas, atención. |
| `--color-sun-soft` | `#FFF1BF` | Badges y estados “muy pronto”. |
| `--color-grass` | `#60AB59` | Éxito, confirmaciones, elementos naturales. |
| `--color-grass-soft` | `#E2F2DF` | Fondos suaves verdes. |
| `--color-sky` | `#4A8ACA` | Información, lengua de signos, enlaces secundarios. |
| `--color-sky-soft` | `#E0EDF9` | Fondos suaves azules. |
| `--color-plum-soft` | `#F4E6EE` | Fondos de medios, hovers neutros. |
| `--color-line` | `#EADCCB` | Bordes de tarjetas y separadores. |

### Reglas de contraste

- `ink` sobre `canvas`/`paper`: **12.5:1 / 13.3:1**. Texto principal siempre.
- `ink-soft` sobre `paper`: **6.6:1**. Texto secundario permitido.
- `ink` sobre `sun`: **8.85:1**. Perfecto para chips y botones amarillos.
- `ink` sobre `grass`: **4.81:1**. Válido para texto normal.
- `ink` sobre `coral`: **4.32:1**. Solo textos grandes (≥24 px o ≥18.7 px bold).
- `paper` sobre `coral-strong`: **5.48:1**. Botones y enlaces con texto pequeño.
- `ink` sobre `sky`: **3.73:1**. No usar texto pequeño sobre azul lleno; usar
  `sky-soft` con `ink`.
- Nunca uses texto pequeño blanco sobre `sun` o `grass`.

### Asignación semántica

- **Primaria:** `coral-strong` para botones, enlaces y foco.
- **Marca/decoración:** `coral` para doodles, formas y acentos grandes.
- **Atención:** `sun` para subrayados, estrellas y el estado “muy pronto”.
- **Éxito:** `grass`.
- **Información/Signos:** `sky`.
- **Superficie:** `paper`; **fondo:** `canvas`.

---

## 3. Tipografía

Dos familias, disponibles vía `next/font`:

- **Averia Libre** — display, títulos, nombres, logotipo y botones. Es la voz
  juguetona del sistema. Pesos: 400 y 700.
- **Nunito** — cuerpo, párrafos, metadatos y etiquetas. Aporta legibilidad.
  Pesos: 400, 600 y 700.

### Escala

| Estilo | Tamaño / línea | Uso |
| --- | --- | --- |
| Display | `clamp(2.6rem, 6vw, 4.5rem)` / `0.96` | Títulos de página y nombres de animal en el reproductor. |
| H1 | `clamp(2.5rem, 6vw, 4.25rem)` / `0.98` | Título principal de cada pantalla. |
| H2 | `clamp(2rem, 4vw, 3rem)` / `1.02` | Títulos de sección. |
| H3 | `clamp(1.5rem, 2.5vw, 2rem)` / `1.1` | Nombres de tarjetas. |
| H4 | `20px` / `24px` | Nombres de animales en créditos. |
| Body LG | `18px` / `28px` | Texto introductorio. |
| Body | `16px` / `26px` | Texto general. |
| Body SM | `14px` / `20px` | Metadatos y ayudas. |
| Label | `12px` / `16px`, 700, uppercase, tracking `.08em` | Eyebrows, roles, chips. |

### Reglas

- Títulos con `letter-spacing` negativo (`-0.02em` a `-0.045em`) y peso 400 en
  Averia. El 700 se reserva para el logotipo, nombres de tarjeta y botones.
- No uses más de dos familias ni más de tres pesos en una misma pantalla.
- No pongas párrafos largos en Averia; usa Nunito.
- Las etiquetas en mayúsculas son cortas (1-3 palabras) y llevan tracking amplio.

---

## 4. Espaciado y layout

- Base: **4 px**. Escala: `4 / 8 / 16 / 24 / 32 / 48 / 64`.
- Padding horizontal de página: **20 px** móvil, **28 px** desde 640 px.
- Contenedor general: **1180 px**; contenido de lectura: **1080 px**.
- Ritmo vertical entre bloques: `clamp(28px, 4vw, 40px)`.
- Breakpoints principales: **480**, **640**, **800**, **1200** px.
- Página estándar:
  1. `main` con fondo `canvas` y doodles absolutos.
  2. `Container` con `z-index: 1`.
  3. **Topbar** (marca o volver + badge de contexto).
  4. **Hero** (label, H1 con marcador, lead).
  5. **Contenido** (grid o tarjeta grande).
  6. **Footer** discreto.
- Evita centrar bloques de texto largos: máximo 580-640 px de ancho.

---

## 5. Forma y elevación

| Token | Valor |
| --- | --- |
| `--radius-sm` | `12px` |
| `--radius-md` | `20px` |
| `--radius-lg` | `32px` |
| `--radius-media` | `40px` |
| `--radius-full` | `999px` |

- Tarjetas: `32px`. Marcos de medios: `40px`; medios interiores: `24-30px`.
- Botones, chips e iconos: pill (`999px`).
- Bordes: `2px solid var(--color-line)`; en hover/activo, `var(--color-ink)`.
- Avatares: blobs orgánicos con `border-radius: 46% 54% 55% 45% / 45% 42% 58% 55%`.
- Inclinación: `-1.4deg` a `1.5deg` solo en escritorio; en móvil se enderezan.
- Sombras:
  - Tarjeta: `0 7px 0 rgba(93,0,69,.06), 0 18px 40px rgba(93,0,69,.08)`.
  - Hover: `0 12px 0 rgba(93,0,69,.06), 0 28px 60px rgba(93,0,69,.16)`.
  - Acción: `0 5px 0 rgba(93,0,69,.12)`.
  - Medios: `0 22px 60px rgba(93,0,69,.18)`.
- No apiles más de una sombra offset por elemento ni uses sombras duras negras.

---

## 6. Componentes

### Wordmark

- Texto `SolanoZambrano` en Averia Libre 700, con la S y la Z en mayúscula,
  tracking `-0.05em`.
- Trazo ondulado coral debajo, del ancho del wordmark. Área táctil mínima de 44 px.
- Solo en la pantalla de inicio y, si hace falta, como enlace de retorno.

### Back button

- Altura 44 px, fondo `paper`, borde 2 px `line`, texto `ink` 14/700.
- Icono de chevron 18 px. Hover: `sun-soft` y borde `ink`.
- Siempre con `aria-label` que describa el destino (“Volver a Animales”).

### Botón primario

- Fondo `coral-strong`, texto `paper`, pill, altura 50-64 px, peso 700.
- Sombra de acción. Hover `coral-dark`; activo baja 2 px y pierde sombra.
- Una sola acción primaria por pantalla.

### Botón secundario / ActionIcon

- Fondo `paper`, borde 2 px `line`, texto `ink`; hover `sun-soft`.
- ActionIcon: 44/48/56 px, círculo perfecto, icono 20-24 px.
- Usa `aria-label` cuando no haya texto visible.

### Badge / chip

- Pill, fondo soft del color elegido, texto `ink`, 12/700.
- Alturas: 22-34 px. No uses badges llenos con texto pequeño.
- Colores permitidos: `coral`, `sun`, `grass`, `sky` en variante `light`.

### Tarjeta base

- `paper`, borde 2 px `line`, radio 32 px, sombra de tarjeta.
- Hover: eleva 6-8 px, endereza la inclinación y oscurece el borde a `ink`.
- Foco: outline 3 px `coral-strong` con offset 4 px.
- No uses más de un nivel de tarjeta dentro de otra tarjeta.

### Perfil familiar

- Avatar blob de 92-128 px con color de la paleta (sol, cielo, coral, ciruela,
  verde).
- Letra inicial en Averia 700, color `ink` (contraste seguro en los cinco tonos).
- Nombre en Averia 25-29 px; rol en label uppercase.
- Perfil activo: pill `Entrar` coral. Perfil pendiente: borde discontinuo,
  saturación reducida y badge `Muy pronto` sol.
- Inclinación alterna en escritorio; sin inclinación en móvil.

### App tile (Alaia)

- Tarjeta grande con grid de 2 columnas desde 800 px.
- Escenario coral-soft con logo flotante, sol y estrella.
- Título en Averia 40-58 px, descripción Nunito, chips y CTA.
- Toda la tarjeta es el enlace; el CTA es visual, no un botón anidado.

### Animal card

- Tarjeta `paper` con borde 2 px y radio 32 px.
- Imagen cuadrada con margen interior de 10 px y radio 24 px.
- Badge de sonido circular 42 px con borde `ink` en la esquina.
- Nombre en Averia 24 px; onomatopeya en chip light rotando
  `coral → sun → grass → sky`.
- Hover: eleva 6 px, gira `-0.7deg`, imagen escala 1.045.

### Reproductor de animal

- Overlay fijo a pantalla completa, fondo `canvas` con halos suaves.
- Marco de medios `paper`, borde 2 px, radio 40 px, padding 9 px; interior 30 px.
- Cabecera: cerrar 48 px + contador pill sol.
- Nombre en display; onomatopeya con `Marker` amarillo.
- Toggle de signos en `sky-soft`; botón “Otra vez” coral 64 px; flechas 56 px.
- En móvil, todo debe caber sin scroll en un iPhone de 844 px de alto.
- Mantén foco inicial en cerrar, trampa de foco, Escape, flechas y espacio.

### Créditos

- Grid de 2 columnas desde 768 px.
- Tarjeta con borde superior de 8 px en el tono de la fila.
- Título H4; `dt` con badge light; `dd` en body-sm gris-morado.
- Enlaces en `coral-strong`, subrayados siempre.

### Doodles y marcador

- Formas disponibles: `Squiggle`, `Sun`, `Sparkle`, `Loop`, `Zigzag`.
- Colores de la paleta, opacidad 0.35-0.9, nunca sobre texto.
- Decorativos: `aria-hidden`, `pointer-events: none`.
- Animación de flotación de 7 s; se desactiva con `prefers-reduced-motion`.
- `Marker`: trazo amarillo detrás de 1-2 palabras del título, altura `0.34em`,
  `bottom: -0.08em`. No subrayes frases completas.

---

## 7. Movimiento

- Transiciones de **180-200 ms**, `ease` o `ease-out`.
- Hover de tarjeta: `translateY(-6px/-8px)` + rotación a 0.
- Activo: baja 2 px y reduce sombra; nunca rebotes.
- Aparición del reproductor: fade + escala 0.98 → 1 en 200 ms.
- Barras de sonido: 700 ms en loop mientras suena el audio.
- Con `prefers-reduced-motion: reduce`: sin animaciones, sin flotación, sin
  barras animadas y póster estático en lugar de vídeo.

---

## 8. Accesibilidad

- Contraste mínimo AA (4.5:1 texto normal, 3:1 texto grande).
- Objetivos táctiles: **44 px** mínimo; acciones principales **56-64 px**.
- Foco visible en todos los controles: 3 px `coral-strong`, offset 3-4 px.
- Iconos decorativos con `aria-hidden="true"`; iconos solos con `aria-label`.
- Un solo `h1` por pantalla; jerarquía de títulos sin saltos.
- Imágenes de animales principales con texto alternativo descriptivo; pósters
  decorativos con `alt=""`.
- El audio nunca suena sin gesto del usuario.
- El reproductor atrapa el foco, cierra con Escape y restaura el foco al abrirse.
- En el flujo infantil no hay enlaces externos; las fuentes viven en créditos.
- Respeta `prefers-reduced-motion` y el tamaño de fuente del navegador.

---

## 9. Contenido

- Español de España, cercano y breve.
- Tuteo cálido; evitar diminutivos excesivos y mayúsculas sostenidas.
- Títulos de 2-6 palabras; descripciones de 1-2 frases.
- Las etiquetas en mayúsculas son cortas y sirven de contexto, no de párrafo.
- Estados: “Muy pronto”, “Tu espacio”, “En preparación”.
- No uses emojis en la UI principal; usa doodles del sistema.

---

## 10. Implementación

- **Tema Mantine:** `src/theme.ts` define paletas `coral`, `sun`, `grass`, `sky`,
  tipografías, radios, sombras y defaults de componentes.
- **Tokens CSS:** `src/styles/design-tokens.css` es la fuente de verdad para CSS
  Modules y para los overrides semánticos de Mantine.
- **Tipografías:** Averia Libre y Nunito se sirven localmente desde
  `public/fonts` con `@font-face` en `src/styles/design-tokens.css`. Los tokens
  `--font-display` y `--font-text` son la única referencia.
- **Estilos de pantalla:** CSS Modules junto a cada página. No se añaden
  utilidades globales nuevas sin documentarlas aquí.
- **Componentes compartidos:** `src/components` (`BackButton`, `Marker`,
  `BrandMark`, `PageDoodles`, `CrayonDoodles`).
- **Mantine:** usar `Title`, `Text`, `Card`, `Button`, `Badge`, `ActionIcon`,
  `Container`, `Stack`, `Group`, `SimpleGrid` y `Box` antes de crear HTML suelto.
- **Sin temas por perfil:** no reintroducir `data-profile-theme` ni paletas
  alternativas. Los perfiles comparten este sistema.
- **Añadir una pantalla:**
  1. `main` con `PageDoodles` y `Container`.
  2. Topbar con `BackButton` o `BrandMark` + badge de contexto.
  3. Hero con label, H1 y `Marker`.
  4. Contenido con tarjetas del sistema.
  5. Footer discreto.
  6. Test de comportamiento + revisión de contraste y foco.

---

## 11. Mapa de pantallas

| Ruta | Pantalla | Patrón |
| --- | --- | --- |
| `/` | Selector familiar | Wordmark + hero + 5 tarjetas de perfil |
| `/alaia` | Launcher de Alaia | Back + hero + app tile grande |
| `/alaia/animales` | Cuadrícula de animales | Back + hero + grid 2/3/4 |
| `/alaia/animales/creditos` | Créditos | Back + hero + grid de fuentes |
| Reproductor | Overlay de animal | Marco de medios + detalles + controles |

---

## 12. Do / Don't

**Do**

- Usa `paper` para superficies y `canvas` para el fondo.
- Reserva `coral` para formas grandes y `coral-strong` para acciones.
- Mantén los bordes de 2 px y las sombras de sticker.
- Usa el marcador amarillo en una sola palabra clave por título.
- Deja respirar: contenedores amplios y ritmo vertical constante.

**Don't**

- No introduzcas colores fuera de la paleta.
- No uses degradados complejos, glassmorphism ni sombras negras.
- No pongas texto pequeño sobre coral, azul o amarillo llenos.
- No mezcles más de dos familias tipográficas.
- No añadas temas por perfil ni estilos ad hoc fuera de los tokens.
- No uses animaciones rápidas, parpadeos ni autoplay de audio.
- No copies recursos de la referencia: la identidad se inspira, no se replica.