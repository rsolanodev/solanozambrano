## Purpose

Define cómo Alaia entra desde el selector familiar a un espacio propio con tema y launcher, y cómo se presenta la app Animales dentro de ese espacio.

## ADDED Requirements

### Requirement: Perfil de Alaia activo en el selector familiar
El selector familiar SHALL presentar el perfil de Alaia como un perfil activo que navega a `/alaia`, y MUST dejar de mostrarlo como "Próximamente".

#### Scenario: Alaia entra desde el selector
- **WHEN** la persona usuaria activa el perfil de Alaia en `/`
- **THEN** el sistema navega a `/alaia`
- **AND** el perfil de Alaia ya no muestra el estado "Próximamente"

### Requirement: Tema visual propio en todas las rutas de Alaia
Todas las rutas bajo `/alaia` SHALL renderizarse dentro de un contenedor con `data-profile-theme="alaia"` y MUST usar la paleta lavanda/morada definida para Alaia.

#### Scenario: El layout aplica el tema
- **WHEN** se renderiza cualquier página bajo `/alaia`
- **THEN** el contenedor raíz de la ruta tiene `data-profile-theme="alaia"`
- **AND** los colores semánticos de fondo, superficie, texto y primario corresponden al tema de Alaia

### Requirement: Launcher "Mundo de Alaia"
El launcher de Alaia SHALL mostrar la app Animales como una tarjeta grande y accesible que navega a `/alaia/animales`, y MUST ofrecer un enlace de vuelta al selector familiar.

#### Scenario: Abrir la app Animales
- **WHEN** la persona usuaria activa la tarjeta "Animales"
- **THEN** el sistema navega a `/alaia/animales`

#### Scenario: Volver al selector familiar
- **WHEN** la persona usuaria activa el enlace de vuelta
- **THEN** el sistema navega a `/`

### Requirement: Launcher adecuado para 1-3 años
El launcher SHALL usar objetivos táctiles grandes, texto mínimo y una jerarquía visual en la que la tarjeta de la app sea el elemento principal; MUST NOT mostrar placeholders de apps no disponibles ni enlaces externos en el flujo principal.

#### Scenario: Solo apps disponibles
- **WHEN** se renderiza el launcher
- **THEN** solo aparecen las apps disponibles
- **AND** Animales es la única app listada en esta entrega
