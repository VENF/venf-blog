## ADDED Requirements

### Requirement: card-selector renderiza una grid de tarjetas seleccionables

El sistema SHALL tener un componente `card-selector` que renderiza una grid de tarjetas visuales. Cada tarjeta SHALL mostrar:

- Icono (opcional, desde Lucide)
- Título
- Descripción (opcional)
- Precio (opcional)
- Lista de características (opcional)
- Badge destacado (opcional, ej: "Popular")
- Estado seleccionado/no seleccionado con animación

El componente SHALL aceptar selección única o múltiple según `props.multiple`.

#### Scenario: Selección única de plan

- **WHEN** el usuario hace clic en una tarjeta con `multiple: false`
- **THEN** esa tarjeta se marca como seleccionada con borde y check visual
- **THEN** las demás tarjetas se desmarcan
- **THEN** `onChange` emite el `value` de la tarjeta seleccionada

#### Scenario: Tarjeta destacada

- **WHEN** una opción tiene `highlighted: true`
- **THEN** la tarjeta se renderiza con un badge "Popular" y un borde distintivo

#### Scenario: El LLM describe un card-selector

- **WHEN** el LLM emite `{type:"card-selector", props:{name:"plan", options:[{value:"pro",title:"Pro",price:"$29",features:["10 proyectos"],highlighted:true}]}}`
- **THEN** el `TreeRenderer` lo renderiza como grid de 3 tarjetas
- **THEN** la tarjeta "Pro" aparece con estilo destacado

### Requirement: datepicker selecciona fechas con calendario

El sistema SHALL tener un componente `datepicker` que envuelve `src/components/ui/calendar.tsx`. SHALL soportar:

- Modo `single` (una fecha)
- Modo `range` (rango inicio-fin)
- Fecha mínima y máxima opcionales

#### Scenario: Selección de fecha de nacimiento

- **WHEN** el LLM emite `{type:"datepicker", props:{name:"birthDate", label:"Fecha de nacimiento", mode:"single"}}`
- **THEN** se renderiza un input que al hacer clic muestra el calendario
- **THEN** al seleccionar una fecha, el valor se guarda en `formStore`

#### Scenario: Rango de fechas

- **WHEN** el LLM emite `{type:"datepicker", props:{name:"trip", label:"Fechas del viaje", mode:"range"}}`
- **THEN** se renderiza un selector de rango con dos fechas
- **THEN** el valor emitido es un objeto `{from: Date, to: Date}`

### Requirement: merchant-header muestra la identidad del comercio

El sistema SHALL tener un componente `merchant-header` que muestra:

- Avatar/logo (src)
- Nombre del comercio
- Dirección
- Descripción opcional

#### Scenario: Header en formulario de checkout

- **WHEN** el LLM emite `{type:"merchant-header", props:{name:"Tienda Tech", address:"Calle Principal 123", avatar:"/logo.png"}}`
- **THEN** se renderiza un header con logo a la izquierda, nombre y dirección a la derecha
- **THEN** NO se registra ningún valor en `formStore` (es display)
