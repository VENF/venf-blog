## ADDED Requirements

### Requirement: showWhen evalua condiciones en tiempo real

Cada nodo del árbol SHALL poder incluir un campo `showWhen` que determina si el nodo se renderiza o no. El `TreeRenderer` SHALL evaluar la condición usando el valor actual del campo referenciado en `formStore`. Si la condición no se cumple, el nodo NO se renderiza.

El `showWhen` SHALL soportar las siguientes expresiones:

- `{ field: "nombre", equals: "valor" }`: el campo debe ser exactamente "valor"
- `{ field: "nombre", notEquals: "valor" }`: el campo NO debe ser "valor"
- `{ field: "nombre", in: ["a", "b"] }`: el campo debe ser uno de la lista
- `{ and: [expr1, expr2] }`: todas las expresiones deben cumplirse
- `{ or: [expr1, expr2] }`: al menos una expresión debe cumplirse

#### Scenario: Campo que aparece al seleccionar "Otro"

- **WHEN** el LLM emite un `select` con opciones y un `field` con `showWhen: { field: "category", equals: "other" }`
- **THEN** el campo condicional NO se renderiza inicialmente
- **THEN** cuando el usuario selecciona "other" en el select, el campo aparece con animación
- **THEN** cuando el usuario cambia a otra opción, el campo desaparece con animación

#### Scenario: Condición compuesta AND

- **WHEN** un nodo tiene `showWhen: { and: [{ field: "plan", notEquals: "free" }, { field: "country", equals: "US" }] }`
- **THEN** el nodo solo se renderiza si ambas condiciones se cumplen simultáneamente

#### Scenario: Condición compuesta OR

- **WHEN** un nodo tiene `showWhen: { or: [{ field: "role", equals: "admin" }, { field: "role", equals: "editor" }] }`
- **THEN** el nodo se renderiza si el rol es admin o editor

### Requirement: Las animaciones de showWhen usan AnimatePresence

El `TreeRenderer` SHALL usar `AnimatePresence` de `motion` para animar la entrada y salida de nodos condicionales. La animación SHALL ser un slide + fade (opacity + translateY).

#### Scenario: Animación de reveal

- **WHEN** un campo condicional pasa de oculto a visible
- **THEN** aparece deslizándose desde arriba con fade-in en 0.3s
- **WHEN** pasa de visible a oculto
- **THEN** desaparece deslizándose hacia arriba con fade-out en 0.2s

### Requirement: showWhen se reevalua en cada cambio de campo

El `TreeRenderer` SHALL suscribirse a cambios en `formStore` y reevaluar todas las condiciones `showWhen` cuando cualquier campo referenciado cambie.

#### Scenario: Reevaluación automática

- **WHEN** el usuario cambia el valor de un campo referenciado por `showWhen`
- **THEN** todos los nodos que dependen de ese campo se reevalúan inmediatamente
- **THEN** el DOM se actualiza con las animaciones correspondientes
