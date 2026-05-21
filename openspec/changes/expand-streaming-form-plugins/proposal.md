## Por Qué

El sistema de `streaming-form` actualmente soporta solo 5 tipos de campo (text, email, textarea, select, checkbox). Para cubrir casos de uso reales (contraseñas, OTP, teléfono, rangos, selección múltiple, etc.) es necesario expandir el ecosistema de plugins. Esto permite que el LLM genere formularios más ricos y precisos según el contexto de la conversación.

## Qué Cambia

- Se agregan 11 nuevos plugins de campo al sistema de `streaming-form`
- Se expanden 3 plugins existentes con variantes visuales via `metadata`
- Se crean 2 componentes UI faltantes (`multi-select`, `phone-input`)
- Se instalan 3 dependencias nuevas (`use-mask-input`, `react-aria-components`, `react-payment-inputs`)
- Se refactoriza `FieldDef` en `types.ts` para soportar `metadata?: Record<string, unknown>`

**Nuevos plugins:**

- `password` — input con toggle de visibilidad, barra de fortaleza y checklist de requisitos
- `otp` — input OTP de 4/6 slots con temporizador de reenvío
- `radio` — grupo de radio buttons
- `checkbox-group` — grupo de checkboxes (retorna `string[]`)
- `switch` — toggle switch on/off
- `slider` — slider simple o de rango (configurable via `metadata.mode`)
- `multi-select` — selector múltiple con chips, búsqueda y opción crear
- `phone` — input telefónico con combobox de países y banderas
- `masked-time` — input con máscara `HH:MM:ss`
- `number-stepper` — input numérico con botones -/+
- `card-details` — 3 campos anidados (card number, expiry, CVC)

**Variantes nuevas en plugins existentes:**

- `text` — error, icon-start, icon-end, addons, button, character-limit
- `textarea` — error, character-limit
- `select` — icon (icono leading)

## Capacidades

### Nuevas Capacidades

- `field-password`: Input de contraseña con validación de fortaleza (mín. 12 chars, mayúscula, minúscula, número, especial), toggle de visibilidad y barra de progreso
- `field-otp`: Input OTP de 4 o 6 dígitos con slots individuales y contador de reenvío
- `field-radio`: Grupo de opciones mutuamente excluyentes vía radio buttons
- `field-checkbox-group`: Selección múltiple via checkboxes individuales
- `field-switch`: Toggle binario on/off
- `field-slider`: Control deslizante de valor único o rango
- `field-multi-select`: Selector múltiple con autocompletado, chips removibles y opción crear
- `field-phone`: Input telefónico internacional con detección de país
- `field-masked-time`: Input de hora con máscara automática
- `field-number-stepper`: Input numérico con botones de incremento/decremento
- `field-card-details`: Grupo de 3 campos para tarjeta de crédito (número, expiry, CVC)
- `field-text-variants`: Variantes visuales del campo text (error, iconos, addons, botón, contador)
- `field-textarea-variants`: Variantes visuales del campo textarea (error, contador)
- `field-select-variants`: Variante del campo select con icono leading

### Capacidades Modificadas

_(ninguna — no hay cambios en requisitos de capacidades existentes)_

## Impacto

- **Archivos nuevos**: 11 plugins en `plugins/`, 2 componentes UI en `components/ui/`, 2 archivos de spec
- **Archivos modificados**: `plugins/types.ts`, `plugins/registry.ts`, `plugins/text.plugin.tsx`, `plugins/textarea.plugin.tsx`, `plugins/select.plugin.tsx`
- **Dependencias nuevas**: `use-mask-input`, `react-aria-components`, `react-payment-inputs`
- **Sin breaking changes**: los plugins existentes mantienen su API y comportamiento actual
