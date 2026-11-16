# Materna - Diseño por Perfil

`DESIGN.md` es el índice activo de diseño. Cada perfil debe tener su propio
archivo `DESIGN_<NOMBRE>.md` antes de implementar pantallas específicas para
ese perfil.

## Mapa Actual

| Perfil | Rutas | Documento de diseño | Tema Tailwind |
| --- | --- | --- | --- |
| Selector familiar | `/` | Este archivo | `family` |
| Alaia launcher | `/alaia` | `DESIGN_ALAIA.md` | `alaia` |
| Alaia - Animales | `/alaia/animales/**` | `DESIGN_ALAIA.md` | `alaia` |
| Hogar | Pendiente | Pendiente | Pendiente |
| Rubén | Pendiente | Pendiente | Pendiente |
| Coco | Pendiente | Pendiente | Pendiente |

## Contrato de Implementación

- Antes de modificar UI de un perfil, leer su `DESIGN_<NOMBRE>.md`.
- No reutilizar los tokens visuales de un perfil para otro sin crear antes
  su documento de diseño.
- Las clases Tailwind deben seguir siendo semánticas (`bg-background`,
  `text-primary`, `card-surface`, `btn-primary`, etc.).
- Los valores visuales por perfil viven en `src/styles/profile-themes.css` y se
  activan con `data-profile-theme`.
- Las rutas de un perfil deben envolver sus páginas con un layout que aplique
  el tema correspondiente.

## Selector Familiar

La pantalla raíz `/` solo selecciona perfil. Debe funcionar como una parrilla de
perfiles clara y directa, con foco en los nombres de la familia:

- Hogar
- Rubén
- Alaia
- Coco

Mientras un perfil no tenga rutas propias, se muestra como pendiente y no debe
navegar a una ruta incompleta.

El selector familiar usa un tono claro, colorido y moderno: fondo cálido,
tarjetas de perfil blancas, avatares grandes con color propio por perfil y
microestado “Próximamente” en los perfiles sin ruta activa.

## Apps de Alaia

La ruta `/alaia` es el espacio propio de Alaia. Debe mostrar una tarjeta grande
con la app `Animales` y un enlace claro de vuelta al selector familiar.

La app `Animales` vive bajo `/alaia/animales/**` y muestra una cuadrícula de
animales con poster, nombre y onomatopeya. Al tocar uno se abre un reproductor
con video real en loop y el sonido del animal. Los medios son locales y los
créditos están disponibles en `/alaia/animales/creditos`.
