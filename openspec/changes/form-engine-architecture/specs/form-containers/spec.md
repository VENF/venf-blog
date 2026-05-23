## ADDED Requirements

### Requirement: step-wizard organiza el formulario en pasos

El sistema SHALL tener un contenedor `step-wizard` que:

- Solo acepta hijos de tipo `step`
- Muestra un indicador de progreso visual (pasos completados, actuales, pendientes)
- Provee navegación anterior/siguiente
- Solo muestra el contenido del paso activo
- Soporta orientación horizontal y vertical

#### Scenario: Formulario de registro en 3 pasos

- **WHEN** el LLM emite un `step-wizard` con 3 hijos `step`
- **THEN** el indicador de progreso muestra [●]──[○]──[○]
- **THEN** solo se renderiza el contenido del primer paso
- **THEN** al hacer clic en "Siguiente", se avanza al paso 2 con animación

#### Scenario: Validación al cambiar de paso

- **WHEN** el usuario hace clic en "Siguiente" en el paso 1
- **THEN** se validan los campos del paso actual usando `buildSchema`
- **THEN** si hay errores, se muestran y no se avanza de paso
- **THEN** si es válido, se avanza al siguiente paso

### Requirement: group agrupa campos relacionados visualmente

El sistema SHALL tener un contenedor `group` que:

- Muestra un label opcional como encabezado de sección
- Renderiza los hijos en un CSS grid de 12 columnas (o flex, según `props.layout`)
- Soporta un icono opcional en el encabezado

#### Scenario: Grupo de dirección

- **WHEN** el LLM emite `{type:"group", props:{label:"Dirección de envío"}, children:[{type:"field", props:{fieldType:"text", name:"street"}}, {type:"field", props:{fieldType:"text", name:"city"}}]}`
- **THEN** se renderiza un recuadro visual con label "Dirección de envío"
- **THEN** los fields se renderizan dentro con grid de 12 columnas

### Requirement: columns divide el espacio en columnas iguales

El sistema SHALL tener un contenedor `columns` que divide el ancho disponible en N columnas iguales. Los hijos se distribuyen secuencialmente.

#### Scenario: Dos columnas con fields relacionados

- **WHEN** el LLM emite `{type:"columns", props:{count:2}, children:[{field1}, {field2}]}`
- **THEN** field1 ocupa la columna izquierda (50%) y field2 la derecha (50%)

### Requirement: accordion permite secciones expandibles

El sistema SHALL tener un contenedor `accordion` que:

- Solo acepta hijos de tipo `accordion-item`
- Soporta expandir un item a la vez o múltiples según `props.allowMultiple`
- Renderiza cada item con header cliqueable y contenido expandible con animación

#### Scenario: Configurador con secciones plegables

- **WHEN** el LLM emite un `accordion` con 2 `accordion-item`
- **THEN** el primer item se muestra expandido
- **THEN** al hacer clic en el segundo header, el primero se colapsa y el segundo se expande
