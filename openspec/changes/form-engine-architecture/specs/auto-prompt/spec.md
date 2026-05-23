## ADDED Requirements

### Requirement: Script genera la sección de piezas del prompt

El sistema SHALL tener un script `scripts/generate-prompt-section.ts` que:

- Lee `pieces-registry.json`
- Para cada pieza, genera una entrada markdown con: type, descripción, props, reglas de composición
- Agrupa las piezas por categoría (inputs, display, containers, visuales)
- Incluye el catálogo de iconos con grupos semánticos
- Incluye la sintaxis de `showWhen`
- Imprime el resultado por stdout (para redirigir a archivo o incrustar)

#### Scenario: Generación de sección

- **WHEN** el script se ejecuta
- **THEN** produce markdown con todas las piezas registradas
- **THEN** cada pieza incluye su descripción, props y ejemplos
- **THEN** las piezas están agrupadas por categoría

### Requirement: system-pipeline.md tiene marcadores editables

El archivo `system-pipeline.md` SHALL contener los marcadores `<!-- PIECES_SECTION_START -->` y `<!-- PIECES_SECTION_END -->`. El script SHALL reemplazar SOLO el contenido entre esos marcadores, dejando intacto el resto del archivo.

#### Scenario: Actualización del prompt

- **WHEN** se registra una nueva pieza y se ejecuta el script
- **THEN** el contenido entre los marcadores se reemplaza con la nueva sección
- **THEN** las instrucciones fijas del prompt (antes y después de los marcadores) no se modifican

### Requirement: El script se ejecuta manualmente

El script SHALL ser ejecutado manualmente (no como hook de build). Esto permite al desarrollador controlar cuándo se actualiza el prompt.

#### Scenario: Ejecución manual

- **WHEN** el desarrollador ejecuta `npx tsx scripts/generate-prompt-section.ts`
- **THEN** el script lee el registry, genera la sección y actualiza `system-pipeline.md`
