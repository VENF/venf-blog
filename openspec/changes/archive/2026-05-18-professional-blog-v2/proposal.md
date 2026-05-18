## Why

The blog is functional but lacks modern reading features, a searchable index, an interactive code/projects section, any testing infrastructure, and API backend support. Adding these capabilities transforms it from a basic SSG blog into a professional-grade developer portfolio with dynamic content discovery, interactive demos, and automated quality assurance.

## What Changes

- **Post pages redesigned**: Remove sidebar, center content, add reading progress bar, collapsible table of contents, code block with copy + language badge, image lightbox, reading time, author bio, related posts, and prev/next navigation
- **New /blog index page**: Searchable grid with date and tag filters, paginated, using Fuse.js client-side search (SSG + embedded index)
- **New /codigo section**: Project listing and per-project pages with interactive demos served as separate pages with automatic filesystem-based registration
- **New Markdown pipeline enhancements**: Add `rehype-slug` for heading IDs, custom `rehype-code-block` plugin for enriched code displays
- **New frontmatter field**: `tags: string[]` added to all posts for filtering and discovery
- **New API routes**: `/api/posts`, `/api/projects`, `/api/search` for programmatic data access
- **New database client templates**: `lib/dynamodb.ts` with multi-table DynamoDB support and `lib/redis.ts` with env-based Redis configuration
- **Testing infrastructure**: Vitest + React Testing Library for unit/component tests, Playwright for integration/e2e tests
- **Style guide documented**: Explicit conventions for file naming, exports, imports, component patterns, and CSS

## Capabilities

### New Capabilities

- `post-redesign`: Centered article layout with reading progress, table of contents, enhanced code blocks, image lightbox, author bio, related posts, and post navigation
- `blog-search`: Searchable blog index with Fuse.js, date and tag filters, paginated grid layout
- `code-section`: Project listing, per-project documentation pages, and interactive demo pages with auto-registration from `_projects/` directory
- `api-backend`: Route handlers for posts, projects, and search; DynamoDB multi-table client template and Redis client template
- `testing-infrastructure`: Vitest setup with React Testing Library and Playwright for unit, component, and integration tests

### Modified Capabilities

_(None — no existing specs to modify)_

## Impact

- **Architecture**: New `_projects/` directory convention mirrors `_posts/`; new `app/blog/`, `app/codigo/`, and `app/api/` routes
- **Dependencies added**: `fuse.js`, `rehype-slug`, `unist-util-visit` (production); `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`, `@playwright/test` (development)
- **Post frontmatter**: All existing posts need `tags` field added
- **Components**: ~20 new components across `_components/`, `_components-code/`, and `lib/`
- **Tests**: ~10 new test files across unit, component, and integration categories
- **No breaking changes**: Existing `/posts/[...slug]` routes remain, `/posts/page.tsx` unchanged
