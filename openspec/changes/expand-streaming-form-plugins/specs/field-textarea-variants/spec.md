## ADDED Requirements

### Requirement: Variante "error"

El plugin `textarea` con `metadata.variant = 'error'` SHALL mostrar el textarea con `aria-invalid` y mensaje de error debajo.

#### Scenario: Textarea con error

- **WHEN** `variant = 'error'`
- **THEN** se renderiza `Textarea` con `aria-invalid` y mensaje de error

### Requirement: Variante "character-limit"

El plugin `textarea` con `metadata.variant = 'character-limit'` SHALL mostrar un contador `n / max` abajo a la derecha.

#### Scenario: Contador en textarea

- **WHEN** `variant = 'character-limit'` con `maxLength = 500`
- **THEN** se muestra "0 / 500" que se actualiza al escribir

### Requirement: Validación zod compartida

Ambas variantes usan el mismo schema `z.string().min/max` que el textarea original.

#### Scenario: Validación consistente

- **WHEN** cualquier variante tiene un valor inválido
- **THEN** el schema retorna el mismo error que el textarea original
