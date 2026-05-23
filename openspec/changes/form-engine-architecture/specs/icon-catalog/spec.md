## ADDED Requirements

### Requirement: El LLM puede referenciar iconos Lucide por nombre

Cada pieza que acepte un icono SHALL permitir que el LLM emita `icon: "nombre-del-icono"` en kebab-case. El frontend SHALL resolver el nombre al componente Lucide correspondiente usando la convención kebab-case → PascalCase.

#### Scenario: Resolución de icono

- **WHEN** el LLM emite `{type:"input", props:{name:"email", icon:"mail"}}`
- **THEN** el frontend busca `Mail` en `lucide-react`
- **THEN** renderiza `<Mail className="size-4" />` junto al input

#### Scenario: Icono no encontrado

- **WHEN** el LLM emite `{type:"input", props:{name:"field", icon:"nonexistent-icon"}}`
- **THEN** el frontend muestra un warning en consola
- **THEN** NO renderiza ningún icono (fallback silencioso)

### Requirement: Catálogo de iconos disponible en el prompt

El sistema SHALL mantener un catálogo curado de ~100 iconos Lucide organizados en grupos semánticos. Cada grupo SHALL tener:

- Nombre del grupo (ej: "Identidad", "Contacto", "Pago")
- Lista de nombres de iconos en kebab-case
- Contexto de uso recomendado

#### Scenario: Grupos de iconos en el prompt

- **WHEN** el script genera la sección del prompt
- **THEN** se incluye la lista completa de grupos con sus iconos
- **THEN** cada pieza indica qué grupos de iconos acepta

### Requirement: Cada pieza declara qué grupos de iconos acepta

En la definición de cada pieza, la prop `icon` SHALL poder especificar `iconGroups: string[]` para limitar los iconos disponibles a ciertos grupos semánticos.

#### Scenario: Password solo acepta iconos de seguridad

- **WHEN** se define `props.icon.iconGroups: ['security']`
- **THEN** el prompt generado indica que password solo acepta iconos del grupo seguridad
- **THEN** el LLM solo emite lock, key, shield, eye, eye-off para ese campo
