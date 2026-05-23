## ADDED Requirements

### Requirement: El registry contiene todas las piezas disponibles

El sistema SHALL tener un `pieces/registry.ts` que expone un `Map<string, PieceDefinition>` con todas las piezas registradas. Cada `PieceDefinition` SHALL incluir:

- `type`: identificador único
- `name`: nombre legible
- `description`: descripción para el LLM
- `category`: `'field' | 'display' | 'container'`
- `props`: schema de props que el LLM puede emitir
- `component`: componente React a renderizar
- `skeletonComponent?`: skeleton para loading
- `acceptsChildren`: boolean
- `allowedChildren?`: string[] opcional (tipos permitidos como hijos)
- `buildSchema?`: función que construye Zod schema (solo para `field`)
- `defaultValue?`: valor por defecto (solo para `field`)

#### Scenario: Registro de un field existente

- **WHEN** se registra una pieza de tipo `text` con `category: 'field'`
- **THEN** el `TreeRenderer` la encuentra por `type: 'text'`
- **THEN** usa `buildSchema` para validación y `defaultValue` para valor inicial

#### Scenario: Registro de un display

- **WHEN** se registra una pieza de tipo `avatar` con `category: 'display'`
- **THEN** el `TreeRenderer` la renderiza pero NO la incluye en el estado del formulario
- **THEN** `buildSchema` y `defaultValue` son undefined

#### Scenario: Registro de un container

- **WHEN** se registra una pieza de tipo `step-wizard` con `category: 'container'`
- **THEN** el `TreeRenderer` la renderiza y pasa `children` para que los gestione internamente
- **THEN** `acceptsChildren` es true

### Requirement: El registry se puede leer como JSON

El sistema SHALL tener un archivo `pieces-registry.json` que refleje el contenido del registry para ser consumido por el script de generación de prompt.

#### Scenario: Script lee el registry

- **WHEN** el script `generate-prompt-section.ts` se ejecuta
- **THEN** lee `pieces-registry.json`
- **THEN** produce markdown con todas las piezas, sus props y descripciones

### Requirement: Los 16 plugins actuales se adaptan automáticamente

El sistema SHALL tener una función `pluginToPiece()` que convierte cada `FieldPlugin` existente en `PieceDefinition` sin modificar su código interno.

#### Scenario: Adaptación de text.plugin

- **WHEN** `pluginToPiece(textPlugin)` se ejecuta
- **THEN** retorna una `PieceDefinition` con `type: 'text'`, `category: 'field'`
- **THEN** el componente, skeleton, buildSchema y defaultValue son los mismos del plugin
