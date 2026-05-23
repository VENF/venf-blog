# Tasks

## Phase 1 — Foundation (component-tree + piece-registry)

### Task 1.1: Actualizar type definitions

- [ ] Agregar `ComponentNode` interface en `types/` o donde corresponda
- [ ] Agregar `PieceDefinition`, `PieceCategory` types
- [ ] Agregar `ConditionalExpr` type para showWhen
- [ ] Actualizar exports de types existentes

**Files:** `types/*`

**Specs:** `component-tree`, `piece-registry`

---

### Task 1.2: Adaptar los 16 plugins actuales via pluginToPiece()

- [ ] Crear función `pluginToPiece(plugin: FieldPlugin): PieceDefinition`
- [ ] Verificar que cada plugin legacy se convierte correctamente
- [ ] No modificar el código interno de los plugins

**Spec:** `piece-registry`

---

### Task 1.3: Crear pieces/registry.ts

- [ ] Crear `Map<string, PieceDefinition>` con los 16 plugins adaptados
- [ ] Definir 3 categorías: field, display, container
- [ ] Exportar el registry y funciones helper (`getPiece`, `getPiecesByCategory`)

**Spec:** `piece-registry`

---

### Task 1.4: Generar pieces-registry.json

- [ ] Crear script o build step que serialice el registry a JSON
- [ ] El JSON incluye type, description, props schema, category
- [ ] Se regenera al agregar nuevas piezas

**Spec:** `piece-registry`

---

### Task 1.5: Reemplazar FormRenderer por TreeRenderer

- [ ] Crear `TreeRenderer` component que recibe un `ComponentNode[]`
- [ ] Implementar renderizado recursivo (depth-first)
- [ ] Soporte para nodos con y sin hijos
- [ ] Fallback visual para tipos desconocidos
- [ ] Mantener `colSpan` para layout en grid de 12 columnas
- [ ] Integrar con el pipeline SSE existente (reemplazar `FormRenderer` + `DynamicField`)
- [ ] Verificar streaming progresivo con parsePartialJson

**Spec:** `component-tree`

---

## Phase 2 — Containers

### Task 2.1: Implementar group container

- [ ] Crear componente `GroupPiece` con label opcional e icono
- [ ] Layout grid/flex según props
- [ ] Registrar en pieces/registry.ts

**Spec:** `form-containers`

---

### Task 2.2: Implementar columns container

- [ ] Crear `ColumnsPiece` que distribuye hijos en N columnas iguales
- [ ] Registrar en registry

**Spec:** `form-containers`

---

### Task 2.3: Implementar step-wizard container

- [ ] Crear `StepWizardPiece` con indicador de progreso y navegación
- [ ] Solo acepta hijos de tipo `step`
- [ ] Validación al cambiar de paso usando `buildSchema`
- [ ] Animación de transición entre pasos
- [ ] Registrar en registry

**Spec:** `form-containers`

---

### Task 2.4: Implementar accordion container

- [ ] Crear `AccordionPiece` con soporte single/multi expand
- [ ] Crear `AccordionItemPiece`
- [ ] Animación de expand/colapso
- [ ] Registrar en registry

**Spec:** `form-containers`

---

## Phase 3 — Composites

### Task 3.1: Implementar card-selector

- [ ] Crear `CardSelector` component con grid de tarjetas
- [ ] Soporte single/multiple selection
- [ ] Icono, título, descripción, precio, features, badge
- [ ] Animación de selección
- [ ] Registrar en registry

**Spec:** `composite-inputs`

---

### Task 3.2: Implementar datepicker

- [ ] Envolver `ui/calendar.tsx` en un `Datepicker` component
- [ ] Modos single y range
- [ ] Fecha min/max opcionales
- [ ] Registrar en registry

**Spec:** `composite-inputs`

---

### Task 3.3: Implementar merchant-header

- [ ] Crear `MerchantHeaderPiece` (display component)
- [ ] Avatar, nombre, dirección, descripción
- [ ] Registrar en registry

**Spec:** `composite-inputs`

---

## Phase 4 — showWhen + Animations

### Task 4.1: Evaluar showWhen en TreeRenderer

- [ ] Implementar `evaluateCondition(expr, values)` function
- [ ] Soporte para equals, notEquals, in, and, or
- [ ] Integrar en TreeRenderer (no renderizar si no se cumple)
- [ ] Suscribirse a cambios en formStore para reevaluación automática

**Spec:** `show-when`

---

### Task 4.2: Animaciones con AnimatePresence

- [ ] Envolver nodos condicionales en `<AnimatePresence>`
- [ ] Animación de slide + fade (opacity + translateY)
- [ ] Timing: entrada 0.3s, salida 0.2s
- [ ] Colocar `motion.div` en el TreeRenderer

**Spec:** `show-when`

---

## Phase 5 — Icon Catalog

### Task 5.1: Crear catálogo de iconos

- [ ] Definir `ICON_GROUPS` con ~100 iconos en 12 grupos semánticos
- [ ] Incluir en types o en un archivo `pieces/icon-catalog.ts`
- [ ] Exportar función `resolveIcon(name)` que resuelve kebab → PascalCase → Lucide component

**Spec:** `icon-catalog`

---

### Task 5.2: Integrar iconos en piezas

- [ ] Cada pieza que acepte iconos declara `iconGroups: string[]`
- [ ] Fallback silencioso si icono no encontrado
- [ ] Renderizar `<IconComponent className="size-4" />` en campos que acepten icono

**Spec:** `icon-catalog`

---

## Phase 6 — Auto-Prompt

### Task 6.1: Crear script generate-prompt-section.ts

- [ ] Leer `pieces-registry.json`
- [ ] Generar markdown con todas las piezas por categoría
- [ ] Incluir catálogo de iconos
- [ ] Incluir sintaxis showWhen
- [ ] Reemplazar contenido entre marcadores en `system-pipeline.md`
- [ ] Documentar en scripts/README.md (o similar) cómo ejecutar

**Spec:** `auto-prompt`

---

## Phase 7 — Close (run after implementation)

### Task 7.1: Verificar implementación

- [ ] Verificar que todas las tareas están completas
- [ ] Verificar que los tests pasan
- [ ] Ejecutar `npm run lint` y `npm run typecheck`
- [ ] Verificar que el streaming funciona con un formulario de prueba

### Task 7.2: Archivar change

- [ ] Ejecutar openspec-archive-change
- [ ] Sincronizar delta specs con main specs (si aplica)
