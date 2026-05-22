## ADDED Requirements

### Requirement: Variante "icon"

El plugin `select` con `metadata.variant = 'icon'` SHALL mostrar un icono leading antes del select nativo.

#### Scenario: Select con icono

- **WHEN** `variant = 'icon'` con `metadata.icon = 'Globe'`
- **THEN** se renderiza `NativeSelect` con un icono leading

### Requirement: Validación zod compartida

La variante icon usa el mismo schema `z.enum(options)` que el select original.

#### Scenario: Validación consistente

- **WHEN** el valor no está en `options`
- **THEN** el schema retorna el mismo error que el select original
