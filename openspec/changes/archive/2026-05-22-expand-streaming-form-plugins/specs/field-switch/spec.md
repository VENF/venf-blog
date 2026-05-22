## ADDED Requirements

### Requirement: Toggle switch binario

El plugin `switch` SHALL renderizar un `Switch` component que retorna `boolean`.

#### Scenario: Toggle on/off

- **WHEN** el usuario hace clic en el switch
- **THEN** el valor cambia entre `true` y `false`

### Requirement: Validación zod

El schema SHALL retornar `z.boolean()`. Si `required`, usa `.refine(v => v === true)`.

#### Scenario: Validación required

- **WHEN** `required = true` y el valor es `false`
- **THEN** `buildSchema` retorna un error "Required"
