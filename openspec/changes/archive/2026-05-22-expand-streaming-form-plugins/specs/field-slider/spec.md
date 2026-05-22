## ADDED Requirements

### Requirement: Slider configurable single/range

El plugin `slider` SHALL renderizar un `Slider` de radix-ui. Según `metadata.mode`:

- `'single'`: un thumb, retorna `number`
- `'range'`: dos thumbs, retorna `[number, number]`

#### Scenario: Slider single

- **WHEN** `metadata.mode = 'single'` con `min = 0`, `max = 100`
- **THEN** se renderiza un slider con un thumb y display del valor actual

#### Scenario: Slider range

- **WHEN** `metadata.mode = 'range'` con `min = 0`, `max = 1000`
- **THEN** se renderiza un slider con dos thumbs y display del rango "min - max"

### Requirement: Display de valor

El plugin SHALL mostrar el valor actual (single) o el rango (range) junto al slider.

#### Scenario: Display se actualiza

- **WHEN** el usuario mueve un thumb
- **THEN** el display se actualiza en tiempo real

### Requirement: Validación zod

El schema SHALL retornar `z.number()` para single o `z.tuple([z.number(), z.number()])` para range, con `.min()`/`.max()` según corresponda.

#### Scenario: Validación de rango

- **WHEN** `mode = 'range'` y los valores no son válidos
- **THEN** `buildSchema` retorna un error de validación
