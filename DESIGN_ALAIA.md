# Alaia · Notas de producto

Este documento **complementa** `DESIGN.md`. Alaia usa el mismo sistema visual
global (paleta Crayon, Averia Libre + Nunito, tarjetas de 32 px, bordes de 2 px y
sombras de sticker). Aquí solo se recogen las reglas específicas del espacio
infantil.

## Contexto

- Usuaria principal: Alaia, 1-3 años.
- Uso acompañada de un adulto.
- Objetivo: tocar → ver → escuchar, sin menús profundos.
- La imagen y el sonido son la interfaz; el texto es apoyo para el adulto.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/alaia` | Launcher de Alaia |
| `/alaia/animales` | Cuadrícula de animales |
| `/alaia/animales/creditos` | Fuentes y licencias |

## Launcher

- Hero con el título “Mundo de Alaia” y el marcador amarillo en “Alaia”.
- Una única tarjeta grande con la app `Animales`.
- La tarjeta completa es el enlace; el CTA visual no es un botón anidado.
- Chips informativos: número de animales, sonidos reales y signos LSE.
- Fondo `canvas` con doodles suaves; el escenario del logo usa `coral-soft`.

## Cuadrícula de animales

- 2 columnas en móvil, 3 en tablet y 4 en escritorio.
- Tarjeta `paper` con borde `line`, imagen cuadrada con margen interior y badge
  de sonido circular.
- Nombre en Averia 24 px; onomatopeya en chip light rotando
  coral → sol → verde → azul.
- El botón accesible describe la acción: “Escuchar a la vaca”.
- El póster es decorativo (`alt=""`); el nombre accesible está en el botón.

## Reproductor

- Overlay fijo a pantalla completa, fondo `canvas` con halos suaves.
- Marco de medios `paper` con borde 2 px y radio 40 px; interior 30 px.
- Cabecera: cerrar 48 px + contador “1 de 22” en pill sol.
- Nombre en display; onomatopeya con marcador amarillo.
- Controles: “Ver signo LSE” en azul suave, “Otra vez” coral 64 px y flechas de
  56 px.
- El vídeo va mudo y en loop; el audio solo suena tras un toque.
- El reproductor atrapa el foco, cierra con Escape, navega con flechas y restaura
  el foco al cerrar.
- En móvil debe caber sin scroll en un viewport de 844 px de alto.

## Lengua de Signos Española

- Cada animal incluye una imagen del signo de la Fundación CNSE.
- El signo es una vista secundaria: se abre con “Ver signo LSE” y se vuelve con
  “Ver el animal”.
- No se anima ni se reproduce solo.
- La atribución y la licencia viven en `/alaia/animales/creditos`.
- Mantener fondo blanco y alto contraste para que manos y flechas se lean.

## Reglas para 1-3 años

- Objetivos táctiles mínimos de 44 px; principales de 56-64 px.
- Una sola acción principal por pantalla.
- Sin anuncios, analítica, formularios ni menús complejos.
- Sin enlaces externos en el flujo principal.
- Sin parpadeos, cambios bruscos ni animaciones rápidas.
- Respetar `prefers-reduced-motion`: sin animación de entrada, sin barras
  animadas y póster estático en lugar de vídeo.
- Mostrar un estado claro si el audio o el vídeo fallan.

## Créditos

- Grid de 2 columnas desde 768 px.
- Tarjeta con borde superior de 8 px en el tono de la fila.
- Badges `dt` para Video (coral), Audio (verde) y Signo LSE (azul).
- Enlaces externos con `target="_blank"` y `rel="noreferrer"`.
- Mantener las 66 fuentes externas y sus etiquetas accesibles.