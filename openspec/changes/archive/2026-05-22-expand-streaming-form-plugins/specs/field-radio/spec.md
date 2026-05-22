## ADDED Requirements

### Requirement: Grupo de radio buttons

El plugin `radio` SHALL renderizar un `RadioGroup` con `RadioGroupItem` por cada opción en `field.options[]`.

#### Scenario: Renderiza opciones

- **WHEN** el plugin se monta con `options = ["A", "B", "C"]`
- **THEN** se renderizan 3 radio buttons con sus labels

#### Scenario: Selección única

- **WHEN** el usuario selecciona una opción
- **THEN** las demás opciones se deseleccionan automáticamente

### Requirement: Validación zod

El schema SHALL retornar `z.enum(options)` validando que el valor esté entre las opciones disponibles.

#### Scenario: Validación de opción inválida

- **WHEN** el valor no está en `options`
- **THEN** `buildSchema` retorna un error de validación
