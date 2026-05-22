## Contexto

El sistema `streaming-form` usa una arquitectura de plugins donde cada tipo de campo (`text`, `email`, `textarea`, `select`, `checkbox`) es un plugin independiente registrado en un `Map<string, FieldPlugin>`. Cada plugin define:

- `component`: React component que renderiza el campo
- `skeleton`: React component para el estado de carga
- `buildSchema`: función que construye un zod schema para validación
- `defaultValue`: valor por defecto
- `type`: identificador único

Los campos se definen via `FieldDef` (name, type, label, placeholder, required, options, minLength, maxLength, pattern). El LLM genera un array de `FieldDef` que el `FormRenderer` convierte en UI via `DynamicField` → `fieldRegistry.get(type)`.

Actualmente no hay soporte para variantes visuales de un mismo tipo de campo, ni para campos compuestos (card-details), ni para tipos más complejos (contraseña con validación, OTP, etc.).

## Metas / No Metas

**Metas:**

- Soportar 14 nuevos tipos/capacidades de campo en el sistema de plugins
- Mantener compatibilidad total con los 5 plugins existentes (sin breaking changes)
- Cada plugin nuevo incluye: componente, skeleton, buildSchema (zod), defaultValue
- Las variantes visuales se manejan via `metadata: Record<string, unknown>` en `FieldDef`
- Todos los plugins se registran en `registry.ts`

**No Metas:**

- No se modifican los hooks `use-streaming-form` ni `use-form-flow-display`
- No se cambia el shell principal `streaming-form-shell.tsx`
- No se añade lógica de negocio específica al analyzer del LLM (solo tipos de campo)
- No se implementa i18n en los plugins (los labels vienen del LLM)
- No se modifican tests existentes (los nuevos plugins necesitan sus propios tests)

## Decisiones

### 1. Plugin único `text` con variantes vía `metadata` (vs N plugins separados)

**Decisión:** Un solo plugin `text` que según `metadata.variant` renderiza 7 UIs distintas.

**Razón:** Comparten el mismo zod schema (`z.string().min/max/regex`) y default value (`''`). Separar en N plugins multiplicaría el registry sin beneficio real. El switch de variante es un `if/else` interno.

**Alternativa considerada:** Crear `text-error`, `text-icon`, `text-addons`, etc. como plugins independientes. Descartado por duplicación de lógica de validación y registro.

### 2. Password como plugin standalone (no variante de text)

**Decisión:** `password.plugin.tsx` independiente con UI completa.

**Razón:** El zod schema es único (`min(12) + 4 regex` para mayúscula/minúscula/número/especial), el defaultValue es `''`, pero la UI es radicalmente distinta (toggle visibilidad + progress bar + checklist). No hay código compartido con `text`.

### 3. Slider configurable via `metadata.mode: 'single' | 'range'`

**Decisión:** Un solo plugin `slider` que según `mode` renderiza 1 o 2 thumbs.

**Razón:** El componente `Slider` de radix-ui ya soporta multi-thumb nativamente. El schema cambia: `z.number()` para single, `z.tuple([z.number(), z.number()])` para range. El defaultValue sigue el schema.

### 4. card-details como plugin compuesto

**Decisión:** Un plugin que renderiza 3 inputs (card number, expiry, CVC) y retorna un objeto `{ cardNumber, expiry, cvc }`.

**Razón:** Los 3 campos están fuertemente acoplados (pertenecen a la misma tarjeta, tienen validación cruzada). Separarlos en 3 plugins requeriría lógica de estado compartido fuera del sistema actual. El schema es `z.object(...)` y el defaultValue es un objeto.

### 5. multi-select y phone-input crean componentes UI nuevos

**Decisión:** Se crean `@/components/ui/multi-select.tsx` y `@/components/ui/phone-input.tsx` como componentes shadcn-style, luego se envuelven en plugins.

**Razón:** Estos componentes no existen en el proyecto y son reutilizables fuera del sistema streaming-form. La separación UI/plugin sigue el patrón existente (ej: `input-otp.tsx` es UI, `otp.plugin.tsx` es plugin).

## Riesgos / Trade-offs

| Riesgo                                                                | Mitigación                                                                                                       |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `react-payment-inputs` tiene poco mantenimiento (última release 2022) | Se aísla en un solo plugin; si falla, se reemplaza con implementación manual usando `InputGroup` + masks simples |
| `use-mask-input` puede tener conflictos con el `Input` de shadcn      | Se prueba primero con un input simple; alternativa: implementar mask manual con `onInput` + regex                |
| `react-aria-components` aumenta el bundle size                        | Se importa solo `NumberField` (tree-shakeable); impacto mínimo estimado < 5KB gzip                               |
| `react-phone-number-input` tiene sus propias flags SVG                | Puede duplicar iconos si ya existen flags en el proyecto; aceptable por ahora                                    |
| 14 plugins nuevos aumentan la complejidad del registry                | Se mantiene el patrón actual (`registry.register(...)`) sin cambios arquitectónicos                              |
