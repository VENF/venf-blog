## ADDED Requirements

### Requirement: Vitest configured with React Testing Library

The project SHALL have a `vitest.config.ts` at the root with jsdom environment, React plugin, `@/` path alias resolution, and global test setup. The `tests/setup.ts` SHALL import `@testing-library/jest-dom/vitest` matchers.

#### Scenario: Test runs in jsdom environment

- **WHEN** `vitest run` is executed
- **THEN** tests SHALL execute in a jsdom environment with DOM APIs available

### Requirement: Unit tests for lib functions

Unit tests SHALL exist for `lib/api.ts` (getAllPosts, getPostBySlug, getAllTags, buildTree), `lib/markdownToHtml.ts` (heading IDs, code block wrapper), `lib/search.ts` (buildSearchIndex, searchPosts), and `lib/projects.ts` (getProjectBySlug, getAllProjects).

#### Scenario: getAllPosts returns sorted posts

- **WHEN** `getAllPosts()` is called
- **THEN** posts SHALL be returned sorted by date descending

### Requirement: Component tests for React components

Component tests SHALL exist for `PostHeader`, `CoverImage`, `BlogCard`, `BlogSearch`, and `BlogFilters`. Tests SHALL verify rendering with props, conditional rendering (null/empty states), and user interactions.

#### Scenario: CoverImage returns null without src

- **WHEN** `CoverImage` is rendered with an empty `src`
- **THEN** the component SHALL return null and render nothing

### Requirement: Playwright integration test

A Playwright test SHALL verify the full navigation flow: Home → Blog → Article with scroll → Codigo → Project list. The test SHALL use `@playwright/test` and be executable via `npx playwright test`.

#### Scenario: Navigation flow completes

- **WHEN** the user navigates from home to blog to an article to codigo
- **THEN** each page SHALL render without errors

### Requirement: Test scripts in package.json

The `package.json` SHALL include `test` (`vitest run`), `test:watch` (`vitest`), `test:e2e` (`playwright test`), and `coverage` (`vitest run --coverage`) scripts.

#### Scenario: Test script runs all tests

- **WHEN** `npm test` is executed
- **THEN** all unit and component tests SHALL run via vitest

### Requirement: Post tags in frontmatter

All existing posts in `_posts/` SHALL have a `tags` field added to their frontmatter. This SHALL be a YAML array of strings.

#### Scenario: Existing posts have tags

- **WHEN** `getAllPosts()` is called
- **THEN** every returned post SHALL have a non-empty `tags` array
