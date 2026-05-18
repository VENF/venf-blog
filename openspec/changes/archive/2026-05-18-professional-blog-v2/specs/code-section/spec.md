## ADDED Requirements

### Requirement: Project auto-registration from \_projects/

The system SHALL read project metadata from `_projects/<slug>/meta.md` files using gray-matter. Each project folder SHALL be auto-discovered by scanning subdirectories of `_projects/`. Projects SHALL be sorted by date descending.

#### Scenario: Project appears from meta.md

- **WHEN** a `_projects/example/meta.md` file exists
- **THEN** the project SHALL appear in the project listing

### Requirement: Project listing at /codigo

The `/codigo` route SHALL display all projects in a responsive card grid (2 columns on desktop, 1 on mobile). Each card SHALL show the title, description, technology badges, and a link to the project page.

#### Scenario: Codigo page lists all projects

- **WHEN** a user navigates to `/codigo`
- **THEN** all projects SHALL be displayed as cards in a grid

### Requirement: Project page at /codigo/[slug]

The `/codigo/<slug>` route SHALL display the project's metadata and rendered README content. If the project has `demo: true`, a "Ver demo →" link SHALL be shown.

#### Scenario: Project page renders metadata and readme

- **WHEN** a user navigates to `/codigo/example`
- **THEN** the project's title, description, tech stack badges, and README content SHALL be displayed

#### Scenario: Demo link shown for demo projects

- **WHEN** the project has `demo: true` in its frontmatter
- **THEN** a "Ver demo →" link SHALL appear pointing to `/codigo/example/demo`

### Requirement: Demo page at /codigo/[slug]/demo

The `/codigo/<slug>/demo` route SHALL dynamically import and render the demo component from `_projects/<slug>/page.tsx`. The demo SHALL render in an isolated full-height page.

#### Scenario: Demo page renders project component

- **WHEN** a user navigates to `/codigo/example/demo`
- **THEN** the React component from `_projects/example/page.tsx` SHALL be rendered

### Requirement: Example project scaffold

A single example project SHALL exist at `_projects/example/` with `meta.md`, `page.tsx` (rendering "Hola Mundo"), and `readme.md`. This SHALL serve as a template for future projects.

#### Scenario: Example project is functional

- **WHEN** a user navigates to `/codigo/example/demo`
- **THEN** "Hola Mundo" SHALL be displayed on the page
