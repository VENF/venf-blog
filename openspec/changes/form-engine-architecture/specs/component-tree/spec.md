## ADDED Requirements

### Requirement: El LLM emite un árbol de componentes

El sistema SHALL aceptar un JSON con estructura de árbol donde el nodo raíz es de tipo `form` y contiene hijos anidados. Cada nodo SHALL tener:

- `type`: string que identifica la pieza
- `props`: Record<string, unknown> con las props específicas de la pieza
- `children?`: ComponentNode[] opcional para piezas que aceptan hijos
- `showWhen?`: ConditionalExpr opcional para visibilidad condicional
- `colSpan?`: number opcional (1-12) para layout en grid

#### Scenario: El LLM emite un formulario con grupo anidado

- **WHEN** el LLM recibe un prompt para un formulario con secciones
- **THEN** el JSON emitido contiene un nodo `form` raíz con hijos de tipo `group` que a su vez contienen `field`
- **THEN** el `TreeRenderer` renderiza recursivamente cada nivel

#### Scenario: El LLM emite un formulario plano sin contenedores

- **WHEN** el prompt no especifica estructura
- **THEN** el JSON contiene un nodo `form` raíz con hijos `field` directos
- **THEN** el `TreeRenderer` renderiza los fields en línea sin contenedores visuales

### Requirement: El árbol se emite depth-first

El LLM SHALL emitir el árbol en orden depth-first (primero los hijos de un nodo antes de pasar al siguiente hermano) para maximizar el renderizado progresivo.

#### Scenario: Streaming progresivo de un grupo con 3 fields

- **WHEN** el LLM emite `{type:"group", children:[{field1},{field2},{field3}]}`
- **THEN** field1 se renderiza en cuanto llega su JSON
- **THEN** field2 se renderiza en cuanto llega, sin esperar a field3
- **THEN** field3 se renderiza al final

### Requirement: Nodos desconocidos muestran fallback visual

El sistema SHALL mostrar un placeholder visual si encuentra un `type` que no está registrado en el registry.

#### Scenario: Tipo desconocido en el árbol

- **WHEN** el LLM emite un nodo con `type: "nonexistent-component"`
- **THEN** el `TreeRenderer` renderiza un componente `UnknownPiece` con el nombre del tipo
- **THEN** se muestra un mensaje de advertencia en consola
