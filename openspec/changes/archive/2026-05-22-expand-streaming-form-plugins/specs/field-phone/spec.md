## ADDED Requirements

### Requirement: Input telefónico con selector de país

El plugin `phone` SHALL renderizar un input telefónico con un combobox de países (bandera + código) y validación del número.

#### Scenario: Seleccionar país

- **WHEN** el usuario abre el combobox de países
- **THEN** se muestra una lista de países con bandera y código internacional

#### Scenario: Escribir número

- **WHEN** el usuario escribe un número telefónico
- **THEN** el input formatea el número según el país seleccionado

### Requirement: Validación zod

El schema SHALL retornar `z.string()` validando que el número sea completo.

#### Scenario: Validación de número inválido

- **WHEN** el número telefónico es inválido
- **THEN** `buildSchema` retorna un error de validación
