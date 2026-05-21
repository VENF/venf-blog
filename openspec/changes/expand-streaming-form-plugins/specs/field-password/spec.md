## ADDED Requirements

### Requirement: Password field con toggle de visibilidad

El plugin `password` SHALL renderizar un input de contraseña con un botón de toggle (eye/eye-off) para mostrar/ocultar el texto.

#### Scenario: Toggle visibilidad

- **WHEN** el usuario hace clic en el icono del ojo
- **THEN** el input cambia entre `type="password"` y `type="text"`

### Requirement: Barra de fortaleza de 5 segmentos

El plugin `password` SHALL mostrar una barra de progreso dividida en 5 segmentos coloreados (rojo → amarillo → naranja → verde claro → verde oscuro) según la fortaleza de la contraseña.

#### Scenario: Barra se actualiza al escribir

- **WHEN** el usuario escribe en el campo
- **THEN** la barra se actualiza en tiempo real reflejando la fortaleza

### Requirement: Checklist de requisitos

El plugin `password` SHALL mostrar un checklist con 5 requisitos: mayúscula, minúscula, número, carácter especial, mínimo 12 caracteres.

#### Scenario: Requisito se marca al cumplirse

- **WHEN** el usuario cumple un requisito
- **THEN** el requisito correspondiente se marca como completado (check + color verde)

### Requirement: Validación zod con los 5 requisitos

El schema `buildSchema` SHALL retornar `z.string().min(12)` con 4 `.regex()` adicionales para mayúscula, minúscula, número y carácter especial.

#### Scenario: Validación falla si no cumple requisitos

- **WHEN** el valor no cumple algún requisito
- **THEN** `buildSchema` retorna un error de validación descriptivo
