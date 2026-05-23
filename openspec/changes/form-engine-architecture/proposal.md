## Por qué

El sistema actual de formularios está basado en una lista plana de campos (`fields[]`) que limita la complejidad estructural. No soporta pasos (wizard), secciones visuales, campos condicionales, selectores visuales (cards), calendarios, ni componentes de presentación (avatar, badges, resúmenes). Para un cliente final que espera formularios tipo checkout, registro multi-paso o configuradores de producto, la arquitectura actual se queda corta.

## Qué cambia

- **BREAKING**: Reemplazar `FormRenderer` + `DynamicField` por un `TreeRenderer` recursivo que interpreta un árbol de componentes en lugar de una lista plana
- **BREAKING**: Migrar de `plugins/` (wrappers específicos) a un `pieces/registry` que mapea tipos de componentes directamente desde `src/components/ui/`
- **Nuevo**: Sistema de piezas con 3 categorías — `field` (tiene valor), `display` (solo visual), `container` (anida hijos)
- **Nuevo**: Composites visuales: `step-wizard`, `card-selector`, `datepicker`, `merchant-header`
- **Nuevo**: `showWhen` para campos condicionales con animaciones de entrada/salida
- **Nuevo**: Catálogo de ~100 iconos Lucide agrupados semánticamente para que el LLM los use
- **Nuevo**: Prompt de sistema auto-generado desde el registry (script que lee las piezas y produce la sección markdown)
- **Modificado**: Los 16 plugins actuales se adaptan al registry via adapter, luego se reescriben progresivamente para usar `ui/` directamente

## Capacidades

### Nuevas capacidades

- `component-tree`: El LLM compone un árbol de componentes (`ComponentNode`) en lugar de una lista plana de fields. El `TreeRenderer` lo renderiza recursivamente.
- `piece-registry`: Registro central de todas las piezas disponibles (fields, displays, containers, composites). Define type, props, categoría, y reglas de composición.
- `composite-inputs`: Componentes visuales complejos — card-selector, datepicker — que combinan UI profesional con estado de formulario.
- `form-containers`: Contenedores estructurales — step-wizard, group, accordion, columns — que organizan el layout y navegación del formulario.
- `show-when`: Campos condicionales con sintaxis `showWhen: { field, equals/notEquals/in/and/or }` y animaciones de reveal.
- `icon-catalog`: Catálogo curado de ~100 iconos Lucide agrupados por contexto (identidad, contacto, seguridad, pago, etc.) que el LLM puede referenciar.
- `auto-prompt`: Script que genera la sección de piezas disponibles en `system-pipeline.md` a partir del registry.

## Impacto

- **Código afectado**: `src/features/streaming-form/` — reemplazo de `FormRenderer`/`DynamicField` por `TreeRenderer`; `plugins/` se mantiene temporalmente via adapter pero se migrará progresivamente
- **Nuevos archivos**: `src/features/streaming-form/pieces/` — registry, tree-renderer, composites, icon-catalog, prompt-generator
- **Pipeline**: No cambia — sigue siendo `POST /analyze → SSE → parsePartialJson`; solo cambia la estructura del JSON emitido por el LLM
- **Prompt**: `prompts/form-builder/system-pipeline.md` se reescribe con la nueva sección auto-generada
- **Dependencias**: No se agregan nuevas dependencias externas (lucide-react ya está, calendar ya está en ui/)
- **Stores**: `formStore.setValue` sigue funcionando; `formStore.fields` se reemplaza por `formStore.values` (mapa nombre→valor plano)
