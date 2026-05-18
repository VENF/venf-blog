## ADDED Requirements

### Requirement: Blog index page at /blog

The system SHALL serve a `/blog` route that displays all posts in a responsive card grid. The grid SHALL show 3 columns on desktop (`lg`), 2 columns on tablet (`md`), and 1 column on mobile. Each card SHALL display the cover image, title, date, tags, and a truncated excerpt.

#### Scenario: Blog index renders all posts

- **WHEN** a user navigates to `/blog`
- **THEN** all published posts SHALL be displayed in the card grid

#### Scenario: Card shows post metadata

- **WHEN** a blog card is rendered
- **THEN** it SHALL display the cover image, title, date, tags, and a 2-line truncated excerpt

### Requirement: Client-side search via Fuse.js

The blog index SHALL embed a serialized Fuse.js search index at build time. A search input SHALL filter posts in real-time as the user types, with a 300ms debounce. The search SHALL match against title, excerpt, and tags with weighted scoring (title=2x, tags=1.5x, excerpt=1x). An empty query SHALL display all posts.

#### Scenario: Search filters posts by title

- **WHEN** the user types "hexagonal" in the search input
- **THEN** only posts with "hexagonal" in the title SHALL be displayed

#### Scenario: Empty search shows all posts

- **WHEN** the search input is empty
- **THEN** all posts SHALL be displayed

### Requirement: Date filter

The blog index SHALL display a year filter row. Available years SHALL be extracted dynamically from post dates. Clicking a year SHALL filter posts to that year. A "Todos" option SHALL reset the filter. Only one year SHALL be selectable at a time.

#### Scenario: Year filter shows available years

- **WHEN** posts exist from 2023 and 2024
- **THEN** the filter SHALL show `[Todos] [2023] [2024]` chips

#### Scenario: Year filter filters posts

- **WHEN** the user clicks "2023"
- **THEN** only posts from 2023 SHALL be displayed

### Requirement: Tag filter

The blog index SHALL display a tag filter row. Available tags SHALL be extracted dynamically from all posts. Clicking a tag SHALL filter posts that include that tag. A "Todos" option SHALL reset the filter. Only one tag SHALL be selectable at a time. Tags and year filter SHALL compose (AND logic).

#### Scenario: Tag filter composes with year filter

- **WHEN** "2023" and "hexagonal" are selected
- **THEN** only posts from 2023 tagged "hexagonal" SHALL be displayed

### Requirement: Pagination

The blog index SHALL paginate results at 9 posts per page. A numeric pagination control SHALL appear at the bottom: `[1] [2] [3]`. The current page SHALL be visually distinct. Clicking a page number SHALL update the displayed posts without a full page navigation (client-side only).

#### Scenario: Pagination shows page 1 of 2

- **WHEN** there are 12 posts and the user is on page 1
- **THEN** posts 1-9 SHALL be displayed and pagination SHALL show `[●1] [2]`
