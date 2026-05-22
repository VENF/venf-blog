## ADDED Requirements

### Requirement: Grupo de 3 campos para tarjeta

El plugin `card-details` SHALL renderizar 3 campos anidados (card number, expiry, CVC) que retornan un objeto `{ cardNumber, expiry, cvc }`.

#### Scenario: Renderiza 3 inputs

- **WHEN** el plugin se monta
- **THEN** se renderizan los campos Card Number, Expiry (MM/YY) y CVC

#### Scenario: Formato de card number

- **WHEN** el usuario escribe el número de tarjeta
- **THEN** el input formatea el número en grupos de 4 dígitos

### Requirement: Validación cruzada

El schema SHALL retornar `z.object({ cardNumber: z.string(), expiry: z.string(), cvc: z.string() })` con validaciones individuales.

#### Scenario: Validación completa

- **WHEN** algún campo tiene valor inválido
- **THEN** se muestra error en ese campo específico
