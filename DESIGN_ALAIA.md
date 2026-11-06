---
version: "alpha"
name: Alaia
description: Espacio infantil cálido y lúdico, con paleta lavanda, tarjetas grandes y video real para descubrir animales y sus sonidos.

colors:
  background: "#FAF7FF"
  surface: "#FFFFFF"
  surface-variant: "#F1EAFF"
  primary: "#7C3AED"
  primary-soft: "#EDE4FF"
  secondary: "#C4B5FD"
  text-primary: "#241C3A"
  text-secondary: "#6B6280"
  border-subtle: "#E8DDF7"
  success: "#5BC8A8"
  chart-primary: "#7C3AED"
  chart-secondary: "#EDE4FF"

typography:
  display:
    fontFamily: SF Pro Rounded
    fontSize: 36px
    fontWeight: 700
    lineHeight: 42px
  headline-lg:
    fontFamily: SF Pro Rounded
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
  headline-md:
    fontFamily: SF Pro Rounded
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
  headline-sm:
    fontFamily: SF Pro Rounded
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
  body-md:
    fontFamily: SF Pro Text
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22px
  body-sm:
    fontFamily: SF Pro Text
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-sm:
    fontFamily: SF Pro Text
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.5px

rounded:
  sm: 8px
  md: 20px
  lg: 28px
  full: 999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

animal-accents:
  vaca: "#FFE9D6"
  oveja: "#E8F0FF"
  caballo: "#F3E8D8"
  cerdo: "#FFE0E8"
  gallo: "#FFF1CC"
  pato: "#DDF3FF"
  perro: "#E9E2D8"
  gato: "#EFE4FF"
  leon: "#FFE7C2"
  elefante: "#E2E8F0"
  mono: "#E4F5E8"
  rana: "#DDF7E3"

components:
  app-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 32px
    iconSize: 144px
  animal-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: 0
    imageAspect: "1 / 1"
  animal-player:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
    mediaRounded: "{rounded.lg}"
    mediaMaxWidth: 512px
  sound-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.headline-sm}"
    rounded: "{rounded.full}"
    minHeight: 64px
  player-arrow:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    size: 56px
  chip-animal:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  credits-link:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-sm}"
    underline: true

---

## Overview

Mundo de Alaia es un espacio para una niña de 1-3 años. La interfaz debe sentirse
cálida, tranquila y muy evidente: imágenes grandes, pocos textos y una acción
principal por pantalla. El color protagonista es el lavanda/morado del perfil de
Alaia, sobre fondos claros y superficies blancas.

La app Animales es el primer módulo del espacio. Su objetivo es que Alaia toque
un animal, vea un video real en loop y escuche su sonido. La interacción es de
causa-efecto: tocar → aparece el animal → suena. No hay menús profundos ni
controles pequeños.

## Colors

- **Primary** (`{colors.primary}`): botón "Otra vez", enlaces y acentos. Se usa
  con texto blanco y contraste suficiente.
- **Primary Soft** (`{colors.primary-soft}`): chips, fondos de iconos y estados
  suaves.
- **Background** (`{colors.background}`): fondo general lavanda muy claro.
- **Surface** (`{colors.surface}`): tarjetas, controles y superficies elevadas.
- **Surface Variant** (`{colors.surface-variant}`): fondos de medios y bloques
  secundarios.
- **Text Primary / Secondary** (`{colors.text-primary}`, `{colors.text-secondary}`):
  jerarquía entre títulos, nombres de animales y metadatos para adultos.
- **Animal accents**: cada animal tiene un color pastel propio para la píldora de
  su onomatopeya. No se usan como fondo de pantalla completo ni compiten con el
  morado.

## Typography

- **Display** (`{typography.display}`): nombre del animal en el reproductor.
- **Headline LG** (`{typography.headline-lg}`): título del launcher y de la
  cuadrícula.
- **Headline SM/MD** (`{typography.headline-sm}`, `{typography.headline-md}`):
  nombres de animales y onomatopeyas.
- **Body SM** (`{typography.body-sm}`): textos de apoyo para el adulto.
- **Label SM** (`{typography.label-sm}`): contador, créditos y etiquetas.

La tipografía redondeada se reserva para títulos y nombres; el cuerpo usa la
tipografía de texto del sistema para mantener legibilidad.

## Layout

- Márgenes horizontales: `{spacing.md}` en móvil y `{spacing.lg}` desde tablet.
- Cuadrícula de animales: 2 columnas en móvil, 3 en tablet y 4 en desktop, con
  `{spacing.md}` de separación.
- Ancho máximo de contenido: 1024-1152 px, centrado.
- Sin barra de navegación inferior. El launcher y la cuadrícula tienen un enlace
  de vuelta claro y grande.
- Respetar `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)` en las
  pantallas a sangre.
- El reproductor ocupa la pantalla completa; en landscape, el video y los
  controles se colocan en fila para no cortar el cuadrado.

## Elevation & Depth

- Las tarjetas se separan del fondo con sombras muy suaves de gran blur y baja
  opacidad, en tonos morados.
- El reproductor es una capa fija sobre la cuadrícula, sin sombra interior.
- Los controles circulares tienen sombra suave para indicar que son tocables.
- Evitar sombras duras o múltiples capas de elevación en la misma pantalla.

## Shapes

- Tarjetas y tiles: `{rounded.lg}` (28 px), con esquinas generosas.
- Medios del reproductor: `{rounded.lg}`.
- Botones, chips y controles circulares: `{rounded.full}`.
- No mezclar esquinas rectas con esquinas muy redondeadas en la misma vista.

## Components

- **App tile**: tarjeta grande del launcher con icono, nombre de la app, una
  descripción corta y el número de animales. Debe ser el elemento más grande de
  la pantalla.
- **Animal card**: botón completo con poster cuadrado, nombre, onomatopeya y un
  badge de sonido de 44×44 px como mínimo. El poster es decorativo; el nombre
  accesible del botón describe la acción.
- **Animal player**: diálogo modal a pantalla completa con video cuadrado,
  nombre, onomatopeya, contador, botón "Otra vez", flechas anterior/siguiente y
  cierre. El video va mudo y en loop; el sonido es independiente.
- **Sound button**: acción principal del reproductor, grande y en color primario.
  Repite el audio sin reiniciar el video.
- **Player arrow**: control circular de 56×56 px para cambiar de animal.
- **Chip animal**: píldora con la onomatopeya, usando el acento pastel del animal.
- **Credits link**: enlace discreto en el pie de la cuadrícula, para adultos.

## Motion

- Transiciones de 150-250 ms con ease-out.
- Presión de tarjeta: escala 0.97-0.98.
- Aparición del reproductor: fade + escala 0.98 → 1.
- Barras de sonido: animación suave de 600-800 ms mientras suena el audio.
- Con `prefers-reduced-motion: reduce`: sin animaciones de entrada, sin barras
  animadas y poster estático en lugar de video.

## Reglas para 1-3 años

- La imagen y el sonido son la interfaz; el texto es apoyo para el adulto.
- Objetivos táctiles mínimos de 44×44 px; los principales, de 56-64 px.
- Una sola acción principal por pantalla.
- Sin anuncios, analítica, formularios, enlaces externos ni menús complejos en
  el flujo principal.
- El audio nunca suena antes de un toque.
- No usar parpadeos, cambios bruscos de color ni animaciones rápidas.

## Do's and Don'ts

**Do**

- Usar el morado para la acción más importante de cada pantalla.
- Mantener espacios generosos y tarjetas grandes.
- Mostrar siempre un estado claro si el audio o el video fallan.
- Respetar `prefers-reduced-motion`.
- Dejar los créditos accesibles para el adulto, fuera del flujo principal.

**Don'ts**

- No llenar la pantalla de texto o controles pequeños.
- No usar el morado como fondo completo de pantalla.
- No introducir colores saturados que compitan con los acentos pastel.
- No autoplay de audio sin interacción.
- No usar videos a pantalla completa que recorten al animal.
- No añadir navegación inferior ni menús profundos.
