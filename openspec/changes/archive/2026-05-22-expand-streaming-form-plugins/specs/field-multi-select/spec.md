## ADDED Requirements

### Requirement: Multi-select con chips removibles

El plugin `multi-select` SHALL usar el componente `MultipleSelector` para renderizar un selector múltiple con autocompletado y chips removibles.

#### Scenario: Selección de opciones

- **WHEN** el usuario selecciona opciones del dropdown
- **THEN** aparecen como chips removibles en el input

#### Scenario: Búsqueda en opciones

- **WHEN** el usuario escribe en el input
- **THEN** se filtran las opciones disponibles

### Requirement: Opción "creatable"

El plugin SHALL soportar `metadata.creatable: boolean` para permitir crear opciones nuevas no listadas.

#### Scenario: Crear opción nueva

- **WHEN** `metadata.creatable = true` y el usuario escribe un valor no existente
- **THEN** se muestra "Create 'valor'" como opción seleccionable

### Requirement: Limitación de selección máxima

El plugin SHALL soportar `metadata.maxSelected: number` para limitar la cantidad de opciones seleccionables.

#### Scenario: Límite alcanzado

- **WHEN** el usuario intenta seleccionar más allá de `maxSelected`
- **THEN** se llama a `onMaxSelected` y no se agrega la opción

### Requirement: Validación zod

El schema SHALL retornar `z.array(z.string())`. Si `required`, usa `.min(1)`.

#### Scenario: Validación required

- **WHEN** `required = true` y no hay opciones seleccionadas
- **THEN** `buildSchema` retorna un error "Required"
