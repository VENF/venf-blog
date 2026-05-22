## ADDED Requirements

### Requirement: Input OTP con slots individuales

El plugin `otp` SHALL usar el componente `InputOTP` existente para renderizar slots individuales de 4 o 6 dígitos según `metadata.slots`.

#### Scenario: Renderiza slots

- **WHEN** el plugin se monta con `metadata.slots = 4`
- **THEN** se renderizan 4 slots OTP

### Requirement: Temporizador de reenvío

El plugin `otp` SHALL incluir un contador regresivo opcional via `metadata.resendAfter` (segundos). Al llegar a 0, se muestra un botón "Reenviar código".

#### Scenario: Contador regresivo

- **WHEN** el plugin se monta con `resendAfter = 30`
- **THEN** se muestra un contador "Reenviar en 30s" que decrementa cada segundo

#### Scenario: Botón de reenvío

- **WHEN** el contador llega a 0
- **THEN** se muestra un botón "Reenviar código"

### Requirement: Validación zod

El schema SHALL validar que el string tenga exactamente `metadata.slots` dígitos.

#### Scenario: Validación de longitud exacta

- **WHEN** el valor tiene menos o más dígitos que `slots`
- **THEN** `buildSchema` retorna un error de validación
