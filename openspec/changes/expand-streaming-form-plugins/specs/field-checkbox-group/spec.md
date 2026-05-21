## ADDED Requirements

### Requirement: Grupo de checkboxes

El plugin `checkbox-group` SHALL renderizar un `Checkbox` por cada opción en `field.options[]`, retornando un `string[]` con los valores seleccionados.

#### Scenario: Renderiza checkboxes

- **WHEN** el plugin se monta con `options = ["A", "B", "C"]`
- **THEN** se renderizan 3 checkboxes con sus labels

#### Scenario: Selección múltiple

- **WHEN** el usuario selecciona varias opciones
- **THEN** el valor retornado contiene todas las opciones seleccionadas

### Requirement: Validación zod

El schema SHALL retornar `z.array(z.string())`. Si `required`, usa `.min(1)`.

#### Scenario: Validación required

- **WHEN** `required = true` y ninguna opción está seleccionada
- **THEN** `buildSchema` retorna un error "Required"
