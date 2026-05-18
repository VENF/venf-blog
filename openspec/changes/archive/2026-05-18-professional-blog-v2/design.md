## Context

The blog currently has a basic SSG Markdown pipeline with a sidebar layout for posts, no search/filter capability, no code/projects section, no API routes, and no testing infrastructure. The nav already references `/codigo` but the route returns 404. The `_posts/` directory has 2 Spanish-language technical articles.

The existing stack is Next.js 16.2.5 / React 19.2.4 with Tailwind v4, shadcn/ui radix-nova, `motion` (framer-motion v12), and highlight.js for code syntax.

## Goals / Non-Goals

**Goals:**

- Centered, modern article layout with TOC, scroll progress, enhanced code blocks, image lightbox, reading time, author bio, related posts, and prev/next navigation
- Searchable /blog index with date and tag filters, paginated, using SSG + client-side Fuse.js (Option A from exploration)
- /codigo section with project listing and per-project demo pages using filesystem-based auto-registration
- API routes at /api/posts, /api/projects, /api/search for programmatic data access
- DynamoDB multi-table client template and Redis client template as reusable infrastructure
- Vitest + React Testing Library + Playwright testing setup with unit, component, and integration tests
- Style guide documented and enforced for new code

**Non-Goals:**

- Not migrating existing `/posts/[...slug]` routes (backward compatible)
- Not adding authentication, databases, or user accounts
- Not creating actual project demos beyond the example scaffold
- Not adding a CMS or admin panel (content remains file-based Markdown)

## Decisions

### Decision 1: Article redesign — remove sidebar, centering, keep routes

**Choice:** Remove the sidebar entirely from `/posts/[...slug]`, center content with `max-w-3xl`, and keep the existing route structure (`/posts/[...slug]`).

**Rationale:** The sidebar navigation created visual noise and the post tree is small. Centering improves readability for technical articles. Keeping routes avoids breaking existing links and the nav entry in `components/nav/nav.tsx`.

**Alternatives considered:** Keeping sidebar in a collapsible state (rejected: added complexity without clear benefit), migrating to `/blog/[...slug]` (rejected: breaking change with no gain).

### Decision 2: Markdown pipeline — rehype-slug + custom rehype-code-block plugin

**Choice:** Add `rehype-slug` to auto-generate `id` attributes on headings, and create a custom `rehype-code-block` plugin wrapping `<pre>` elements with a header bar (language badge + copy button).

**Rationale:** Using the rehype AST transformation pipeline is more robust than post-processing HTML with regex. The heading IDs enable the TOC's IntersectionObserver-based scroll tracking and smooth-scroll navigation.

**Alternatives considered:** Post-processing HTML with regex (rejected: fragile, breaks on edge cases), client-side DOM manipulation (rejected: causes layout shift).

### Decision 3: Code block copy — client-side initialization script

**Choice:** The copy button is rendered in the HTML by the rehype plugin, but the click handler is added by a `CodeBlockInit` client component (`'use client'`) that runs once when the article page mounts. This avoids making the entire article a client component.

**Rationale:** Keeps the server component architecture intact. Only the hydration script is client-side.

### Decision 4: Search — SSG + Fuse.js client-side (Option A)

**Choice:** Build the Fuse.js search index at build time, serialize it as JSON, embed it in the `/blog` page, and run all search/filter/pagination logic client-side.

**Rationale:** Zero API calls needed for search. Works offline. Simple implementation. The total post count is small (< 50), so the serialized index is negligible in bundle size.

### Decision 5: Project demos — page aparte with dynamic import

**Choice:** `/codigo/[slug]/demo/page.tsx` dynamically imports the demo component from `_projects/<slug>/page.tsx` using Next.js dynamic import. The demo is served as a separate page, giving it full viewport and isolation.

**Rationale:** Clean isolation from the article layout. Projects can use full viewport for interactive demos. The dynamic import pattern is straightforward in Next.js App Router.

**Alternatives considered:** Inline demo rendering on the project page (rejected: would need to manage demo state alongside documentation), iframe embedding (rejected: sizing and communication overhead).

### Decision 6: Testing — Vitest + RTL + Playwright

**Choice:** Vitest with React Testing Library for unit/component tests, Playwright for integration tests. No Jest to avoid duplicate config with Next.js.

**Rationale:** Vitest is ESM-native, faster than Jest, and shares Vite config conventions. Playwright is the modern standard for e2e testing with excellent DX.

### Decision 7: DynamoDB template — factory pattern per table

**Choice:** `createTableClient(tableName)` returns a scoped client for a single DynamoDB table. This implements the multi-table pattern where each project demo uses its own logical table.

**Rationale:** Aligns with DynamoDB best practices for single-table design per bounded context. Each project demo is isolated. The factory pattern keeps the AWS SDK client singletons shared.

### Decision 8: Redis template — lazy connection with graceful fallback

**Choice:** Redis client uses `lazyConnect: true` and returns no-op when `REDIS_URL` is unset. No crash on missing config.

**Rationale:** The blog should not require Redis to run. The template is ready for use when a project demo needs it, but the base application functions without it.

### Decision 9: Frontmatter — add tags field

**Choice:** Add `tags: string[]` to the existing frontmatter schema. Update `Post` type in `interfaces/post.ts`. Modify `gray-matter` call with `{ date: false }` to prevent automatic date conversion that caused the `arquitectura-hexagonal` 500 error.

**Rationale:** Tags enable the blog search filter, related posts, and future topic grouping. Disabling date parsing prevents the frontmatter date bug from recurring.

## Risks / Trade-offs

- **[Risk] Fuse.js serialized index size** → Mitigation: Post count is small (< 50). If it grows beyond 200, consider moving to API-based search.
- **[Risk] Dynamic import of demo components** → Next.js requires the import path to be statically analyzable. The `@/_projects/<slug>/page` pattern works but the `_projects/` directory is outside `src/`, which may require path resolution configuration.
- **[Trade-off] Removing sidebar** → Users lose the ability to navigate between posts via the sidebar tree. Mitigated by prev/next navigation and the /blog index.
- **[Trade-off] Page aparte for demos** → Demo pages don't share the main site layout (nav, theme). Each demo is responsible for its own styling and theming.
- **[Risk] Copy button hydration** → If `CodeBlockInit` fails to mount, the copy buttons remain inert. Mitigation: button shows always, hydration adds behavior.

## Open Questions

1. Should `_projects/` be added to `tsconfig.json` paths or imported via relative `../../_projects/` path?
