## ADDED Requirements

### Requirement: Number stepper con botones -/+

El plugin `number-stepper` SHALL usar `NumberField` de `react-aria-components` para renderizar un input numérico con botones de decremento/incremento.

#### Scenario: Decrementar valor

- **WHEN** el usuario hace clic en el botón `-`
- **THEN** el valor decrementa según `step` sin bajar de `min`

#### Scenario: Incrementar valor

- **WHEN** el usuario hace clic en el botón `+`
- **THEN** el valor incrementa según `step` sin superar `max`

### Requirement: Atajos de teclado

El plugin SHALL soportar navegación por teclado (ArrowUp/ArrowDown para incrementar/decrementar).

#### Scenario: Teclado

- **WHEN** el input está enfocado y el usuario presiona ArrowUp
- **THEN** el valor se incrementa

### Requirement: Validación zod

El schema SHALL retornar `z.number().min(field.minLength ?? 0).max(field.maxLength ?? Infinity)`.

#### Scenario: Validación de límites

- **WHEN** el valor supera `max` o es menor a `min`
- **THEN** `buildSchema` retorna un error de validación
