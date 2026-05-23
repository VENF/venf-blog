## Context

El sistema actual renderiza formularios a partir de una lista plana de `FieldDef[]` emitida por el LLM. Cada campo es procesado por `DynamicField` que busca el plugin correspondiente en `fieldRegistry` y renderiza su componente. El layout usa un CSS grid de 12 columnas donde cada campo declara su `colSpan`.

Limitaciones detectadas:

- No soporta anidamiento (grupos dentro de grupos, pasos, tabs)
- No hay componentes de presentación (avatar, badges, resúmenes)
- Los campos condicionales requieren lógica ad-hoc
- Cada plugin existente es un wrapper que podría reemplazarse por `ui/` directo
- El prompt de sistema describe el formato plano a mano

## Goals / Non-Goals

**Goals:**

- Arquitectura basada en árbol de componentes que el LLM compone libremente
- TreeRenderer recursivo capaz de renderizar cualquier árbol válido
- Registry extensible con 3 categorías (field, display, container)
- 4 composites funcionales: step-wizard, card-selector, datepicker, merchant-header
- `showWhen` funcional con animaciones de reveal
- Prompt auto-generado desde el registry
- Catálogo de iconos Lucide (~100) con guías de uso contextual
- Los 16 plugins actuales funcionan via adapter mientras se migran progresivamente

**Non-Goals:**

- No se agregan nuevas dependencias externas
- No se cambia el pipeline de streaming (POST → SSE)
- No se cambian los stores de estado base
- No se implementa un sistema de plugins dinámico (MCP)

## Decisions

### 1. Árbol de componentes vs lista plana extendida

| Opción                                | Veredicto                           |
| ------------------------------------- | ----------------------------------- |
| Lista plana con decoradores de layout | ❌ No escala a anidamiento profundo |
| Árbol de componentes (ComponentNode)  | ✅ Elegido                          |
| Template DSL propio                   | ❌ Mayor curva de aprendizaje       |

Razón: El árbol es la representación natural de UI anidada. El `parsePartialJson` ya maneja objetos incompletos, por lo que el streaming progresivo funciona sin cambios.

### 2. Categorías de piezas

Se definen 3 categorías con comportamientos distintos:

| Categoría   | Tiene valor | Se registra en formStore | buildSchema |
| ----------- | ----------- | ------------------------ | ----------- |
| `field`     | ✅ Sí       | ✅ Sí                    | ✅ Sí (Zod) |
| `display`   | ❌ No       | ❌ No                    | ❌ No       |
| `container` | ❌ No       | ❌ No                    | ❌ No       |

Razón: Separar el estado del formulario de los elementos visuales. El submit solo recolecta valores de nodos `field`.

### 3. Adapter para plugins legacy vs reescritura inmediata

Se usa `pluginToPiece()` que adapta cada `FieldPlugin` existente a `PieceDefinition`. Esto permite que los 16 plugins sigan funcionando el día 1 sin reescribirlos. La reescritura para usar `ui/` directamente se hace progresivamente a medida que se toca cada plugin.

### 4. Prompt auto-generado via script

Un script (`scripts/generate-prompt-section.ts`) lee el `pieces-registry.json` y produce la sección markdown de piezas disponibles. Se inserta entre marcadores `<!-- PIECES_SECTION_START -->` y `<!-- PIECES_SECTION_END -->` en `system-pipeline.md`.

Razón: Garantiza que el prompt esté siempre sincronizado con el registry. Sin MCP, sin dependencias externas.

### 5. Catálogo de iconos curado vs listado completo de Lucide

Lucide tiene ~1500 iconos. Listarlos todos satura el prompt. En su lugar, se curan ~100 iconos en 12 grupos semánticos (identidad, contacto, seguridad, pago, etc.). Cada pieza declara qué grupos acepta.

### 6. showWhen como prop del nodo vs wrapper separado

`showWhen` es una propiedad opcional en `ComponentNode`. El `TreeRenderer` la evalúa antes de renderizar. Si la condición no se cumple, retorna `null` con `AnimatePresence` para la animación de salida.

## Riesgos / Trade-offs

| Riesgo                                                                           | Mitigación                                                                                                             |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| El árbol profundo aumenta la latencia de parseo parcial                          | El `parsePartialJson` ya maneja objetos anidados; el streaming es igual de rápido porque el árbol se emite depth-first |
| Los composites nuevos (step-wizard, card-selector) aumentan el tamaño del prompt | Se mantienen descripciones concisas (1-2 párrafos por pieza) y se generan automáticamente                              |
| showWhen puede crear dependencias circulares                                     | Se valida durante el renderizado (máximo 1 nivel de profundidad por ahora)                                             |
| La migración de plugins legacy puede dejar algunos sin funcionalidad completa    | El adapter preserva el comportamiento exacto; la reescritura es opcional y progresiva                                  |
| El prompt auto-generado puede quedar desactualizado si se edita manualmente      | El script sobreescribe solo entre los marcadores; las secciones fijas del prompt no se tocan                           |
