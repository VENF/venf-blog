## ADDED Requirements

### Requirement: Input con máscara HH:MM:ss

El plugin `masked-time` SHALL renderizar un input con máscara automática en formato `HH:MM:ss` usando `use-mask-input`.

#### Scenario: Máscara al escribir

- **WHEN** el usuario escribe dígitos
- **THEN** el input automáticamente inserta los separadores `:` en las posiciones correctas

### Requirement: Validación zod

El schema SHALL retornar `z.string().regex(/^\d{2}:\d{2}:\d{2}$/)` validando el formato de 24h.

#### Scenario: Validación de formato

- **WHEN** el valor no coincide con `HH:MM:ss`
- **THEN** `buildSchema` retorna un error de validación
