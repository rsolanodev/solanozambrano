## Purpose

Define el catálogo de animales, la cuadrícula, el reproductor de video y sonido, los estados de error, la accesibilidad y los créditos de la app Animales de Alaia.

## ADDED Requirements

### Requirement: Catálogo de doce animales
El sistema SHALL definir un catálogo de 12 animales con identificador único, nombre en español, onomatopeya, artículo, categoría, color de acento, video, poster y audio locales, además de los créditos de cada medio.

#### Scenario: Catálogo completo
- **WHEN** se carga el catálogo
- **THEN** contiene exactamente 12 animales
- **AND** todos los identificadores son únicos
- **AND** cada animal tiene nombre, onomatopeya, artículo, video, poster, audio y créditos

#### Scenario: Animal nuevo sin reescribir la interfaz
- **WHEN** se añade un animal al catálogo con sus medios
- **THEN** la cuadrícula y el reproductor lo muestran sin cambios en su lógica de presentación
- **AND** el contador y la navegación se ajustan al nuevo total

### Requirement: Medios locales y optimizados
Cada animal SHALL tener un video MP4 H.264 de 720×720 sin audio, un poster JPG y un audio MP3 mono normalizado. Los medios MUST servirse desde rutas locales bajo `/alaia/animales/` y MUST NOT depender de Pexels, Wikimedia u otro servicio externo en runtime.

#### Scenario: Assets presentes y válidos
- **WHEN** se valida el catálogo
- **THEN** existen los 12 videos, 12 posters y 12 audios en `public/alaia/animales/`
- **AND** cada video termina en `.mp4`, cada poster en `.jpg` y cada audio en `.mp3`
- **AND** cada video pesa menos de 2 MB, cada poster menos de 300 KB y cada audio menos de 500 KB

#### Scenario: Sin peticiones externas de medios
- **WHEN** se abre la cuadrícula o el reproductor
- **THEN** las rutas de video, poster y audio son locales
- **AND** no se solicita ningún medio a un dominio externo

### Requirement: Cuadrícula de animales
La cuadrícula SHALL mostrar los 12 animales como botones grandes con poster, nombre, onomatopeya y una señal visual de sonido. Cada botón MUST tener un nombre accesible que incluya el artículo y el nombre del animal, y MUST ser operable con teclado.

#### Scenario: Render de la cuadrícula
- **WHEN** se abre `/alaia/animales`
- **THEN** se muestran 12 tarjetas
- **AND** cada tarjeta muestra el poster, el nombre y la onomatopeya del animal
- **AND** cada tarjeta tiene un nombre accesible como "Escuchar a la vaca" o "Escuchar al caballo"

#### Scenario: Navegación por teclado
- **WHEN** la persona usuaria recorre la cuadrícula con Tab
- **THEN** cada tarjeta recibe foco visible
- **AND** Enter o Espacio abre el reproductor del animal enfocado

#### Scenario: Diseño adaptable
- **WHEN** la cuadrícula se muestra en un móvil
- **THEN** usa 2 columnas
- **WHEN** se muestra en una tablet o pantalla ancha
- **THEN** usa 3 o 4 columnas
- **AND** las tarjetas mantienen objetivos táctiles grandes

### Requirement: Apertura del reproductor y reproducción del sonido
Al seleccionar una tarjeta, el sistema SHALL abrir un reproductor a pantalla completa, mostrar el video en loop y reproducir el audio del animal. El audio MUST iniciarse dentro del gesto de la persona usuaria y MUST NOT reproducirse al cargar la página sin interacción.

#### Scenario: Abrir un animal
- **WHEN** la persona usuaria toca la tarjeta de la vaca
- **THEN** se abre el reproductor con el nombre "Vaca" y la onomatopeya "¡Muuu!"
- **AND** el video de la vaca se reproduce en loop, mudo y con `playsInline`
- **AND** el audio de la vaca empieza a reproducirse
- **AND** el contador muestra "1 de 12"

#### Scenario: Sin autoplay antes de interactuar
- **WHEN** se carga `/alaia/animales`
- **THEN** no se reproduce ningún audio
- **AND** el audio solo empieza después de seleccionar una tarjeta

### Requirement: Repetición del sonido sin reiniciar el video
El reproductor SHALL ofrecer una acción principal para repetir el sonido desde el principio y SHALL permitir repetirlo tocando el video. La repetición MUST NOT reiniciar ni pausar el video.

#### Scenario: Repetir el sonido
- **WHEN** la persona usuaria pulsa "Otra vez" o toca el video
- **THEN** el audio del animal vuelve a empezar desde el inicio
- **AND** el video continúa reproduciéndose en loop
- **AND** el indicador visual de sonido se activa mientras suena el audio

#### Scenario: El audio termina
- **WHEN** el audio del animal llega a su fin
- **THEN** el video sigue en loop
- **AND** el indicador visual de sonido se detiene
- **AND** la acción principal queda disponible para repetir

### Requirement: Navegación entre animales
El reproductor SHALL permitir ir al animal anterior y al siguiente, con navegación circular, y MUST reproducir el sonido del animal seleccionado al cambiar.

#### Scenario: Siguiente y anterior
- **WHEN** la persona usuaria pulsa "Siguiente"
- **THEN** se muestra el animal siguiente del catálogo
- **AND** se reproduce su sonido
- **WHEN** la persona usuaria pulsa "Anterior"
- **THEN** se muestra el animal anterior
- **AND** se reproduce su sonido

#### Scenario: Navegación circular
- **WHEN** la persona usuaria está en el último animal y pulsa "Siguiente"
- **THEN** se muestra el primer animal
- **WHEN** está en el primer animal y pulsa "Anterior"
- **THEN** se muestra el último animal

### Requirement: Cierre del reproductor y restauración del foco
El reproductor SHALL poder cerrarse con un botón grande, con la tecla Escape y con el botón atrás del navegador. Al cerrarse MUST pausar el audio, detener el video y devolver el foco a la tarjeta que abrió el reproductor.

#### Scenario: Cerrar con el botón
- **WHEN** la persona usuaria pulsa el botón de cerrar
- **THEN** el reproductor desaparece
- **AND** el audio se pausa y el video se detiene
- **AND** el foco vuelve a la tarjeta del animal

#### Scenario: Cerrar con Escape
- **WHEN** el reproductor está abierto y la persona usuaria pulsa Escape
- **THEN** el reproductor se cierra
- **AND** el audio se pausa

#### Scenario: Cerrar con el botón atrás
- **WHEN** el reproductor está abierto y la persona usuaria usa el botón atrás del navegador
- **THEN** el reproductor se cierra sin abandonar `/alaia/animales`

### Requirement: Estados de error de los medios
Si el audio no puede reproducirse, el reproductor SHALL mostrar una acción de reintento clara. Si el video no puede reproducirse, SHALL mostrar el poster del animal como respaldo.

#### Scenario: Error de audio
- **WHEN** la reproducción del audio falla
- **THEN** el reproductor muestra un estado "Toca para escuchar"
- **AND** tocar la acción vuelve a intentar reproducir el audio

#### Scenario: Error de video
- **WHEN** el video falla o no está disponible
- **THEN** el reproductor muestra el poster del animal
- **AND** el audio y la repetición siguen funcionando

### Requirement: Reducción de movimiento
Si el sistema operativo indica `prefers-reduced-motion: reduce`, el reproductor SHALL mostrar el poster estático en lugar de reproducir el video automáticamente, sin impedir que el audio se reproduzca o se repita.

#### Scenario: Movimiento reducido
- **WHEN** la persona usuaria tiene activada la reducción de movimiento y abre un animal
- **THEN** se muestra el poster estático
- **AND** el audio del animal se reproduce
- **AND** la acción "Otra vez" sigue disponible

### Requirement: Créditos de medios
La app SHALL ofrecer una página de créditos en `/alaia/animales/creditos` que liste, para cada animal, la fuente, autor y licencia del video y del audio. La cuadrícula o el launcher MUST incluir un enlace para llegar a ella.

#### Scenario: Consultar créditos
- **WHEN** la persona usuaria abre `/alaia/animales/creditos`
- **THEN** ve los 12 animales
- **AND** cada uno muestra la fuente, autor y licencia del video y del audio
- **AND** los enlaces a las fuentes originales son externos y están identificados como tales

### Requirement: Experiencia segura para 1-3 años
El flujo principal de Animales MUST NOT incluir anuncios, analítica, recolección de datos, enlaces externos ni menús complejos. La interacción principal SHALL ser tocar una imagen grande y MUST usar controles de al menos 44×44 CSS px, con texto de apoyo para el adulto.

#### Scenario: Flujo principal sin elementos ajenos
- **WHEN** se recorre `/alaia` y `/alaia/animales`
- **THEN** no hay anuncios, formularios, enlaces externos ni menús de navegación complejos
- **AND** los controles principales tienen un área táctil mínima de 44×44 CSS px

### Requirement: Accesibilidad del reproductor
El reproductor SHALL exponerse como un diálogo modal accesible, con etiqueta, trampa de foco, cierre con Escape, botones con nombres accesibles y un contador de posición anunciado.

#### Scenario: Diálogo modal
- **WHEN** se abre el reproductor
- **THEN** el foco se mueve al botón de cerrar
- **AND** el contenedor tiene `role="dialog"` y `aria-modal="true"`
- **AND** el fondo no recibe foco mientras el reproductor está abierto
- **AND** el contador de posición se anuncia de forma educada
