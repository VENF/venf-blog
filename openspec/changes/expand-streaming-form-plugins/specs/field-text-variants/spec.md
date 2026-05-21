## ADDED Requirements

### Requirement: Variante "error"

El plugin `text` con `metadata.variant = 'error'` SHALL mostrar el input con `aria-invalid` y un mensaje de error debajo.

#### Scenario: Renderiza error

- **WHEN** `variant = 'error'`
- **THEN** se renderiza `Input` con `aria-invalid` y espacio para mensaje de error

### Requirement: Variante "icon-start" e "icon-end"

El plugin `text` con `metadata.variant = 'icon-start'` SHALL mostrar un icono a la izquierda del input usando `InputGroup` + `InputGroupAddon`. Similar para `'icon-end'` a la derecha.

#### Scenario: Icono izquierdo

- **WHEN** `variant = 'icon-start'` con `metadata.icon = 'Search'`
- **THEN** se renderiza `InputGroup` con icono leading y `Input`

### Requirement: Variante "addons"

El plugin `text` con `metadata.variant = 'addons'` SHALL mostrar botones/texto a ambos lados del input (e.g. `https://` + input + `.com`).

#### Scenario: Addons izquierdo y derecho

- **WHEN** `variant = 'addons'` con `metadata.startAddon = 'https://'` y `metadata.endAddon = '.com'`
- **THEN** se renderiza `InputGroup` con texto leading, `Input`, y texto trailing

### Requirement: Variante "button"

El plugin `text` con `metadata.variant = 'button'` SHALL mostrar un botón inline junto al input.

#### Scenario: Input + botón

- **WHEN** `variant = 'button'` con `metadata.buttonLabel = 'Buscar'`
- **THEN** se renderiza `InputGroup` con `Input` y `Button` inline

### Requirement: Variante "character-limit"

El plugin `text` con `metadata.variant = 'character-limit'` SHALL mostrar un contador `n / max` abajo a la derecha del input.

#### Scenario: Contador al escribir

- **WHEN** `variant = 'character-limit'` con `maxLength = 100`
- **THEN** se muestra contador "0 / 100" que se actualiza al escribir

### Requirement: Validación zod compartida

Todas las variantes usan el mismo schema `z.string().min/max/regex` que el text original.

#### Scenario: Validación consistente

- **WHEN** cualquier variante tiene un valor inválido
- **THEN** el schema retorna el mismo error que el text original
