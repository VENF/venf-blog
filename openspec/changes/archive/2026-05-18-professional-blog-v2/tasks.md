## 1. Foundation — Types, Frontmatter, and Style Guide

- [x] 1.1 Add `tags: string[]` to `src/interfaces/post.ts`
- [x] 1.2 Disable gray-matter date parsing in `src/lib/api.ts` (`{ date: false }`)
- [x] 1.3 Add `getAllTags()` and `extractToc()` to `src/lib/api.ts`
- [x] 1.4 Create `src/lib/search.ts` with `buildSearchIndex()` and `searchPosts()`
- [x] 1.5 Create `src/lib/dynamodb.ts` with `createTableClient()` factory
- [x] 1.6 Create `src/lib/redis.ts` with `getCache()` and graceful no-op fallback
- [x] 1.7 Create `vitest.config.ts` with jsdom, React plugin, and `@/` alias
- [x] 1.8 Create `tests/setup.ts` importing jest-dom matchers
- [x] 1.9 Add `tags` to frontmatter in `_posts/arquitectura-hexagonal.md`
- [x] 1.10 Add `tags` to frontmatter in `_posts/solid.md`

## 2. Markdown Pipeline — rehype plugins

- [x] 2.1 Install `rehype-slug` and `unist-util-visit`
- [x] 2.2 Create `src/lib/rehype-code-block.ts` — custom rehype plugin wrapping `<pre>` with header bar (language badge + copy button)
- [x] 2.3 Update `src/lib/markdownToHtml.ts` — add `rehypeSlug` and `rehypeCodeBlock` to the unified pipeline

## 3. Post Page Redesign — Centered Layout

- [x] 3.1 Refactor `src/app/posts/[...slug]/page.tsx` — remove sidebar, Sheet, Menu imports and grid; center with `max-w-3xl`; add Back link
- [x] 3.2 Create `src/app/_components/scroll-progress.tsx` — fixed top-0 bar tracking scroll percentage
- [x] 3.3 Create `src/app/_components/table-of-contents.tsx` — horizontal bar with IntersectionObserver active heading tracking
- [x] 3.4 Create `src/app/_components/reading-time.tsx` — word count / 200 calculation
- [x] 3.5 Create `src/app/_components/image-zoom.tsx` — lightbox overlay on image/GIF click
- [x] 3.6 Create `src/app/_components/post-navigation.tsx` — prev/next by date with hidden edge links
- [x] 3.7 Create `src/app/_components/related-posts.tsx` — tag-matched posts with recent fallback
- [x] 3.8 Create `src/app/_components/author-bio.tsx` — card with avatar, name, description, social links

## 4. Code Block Enhancement

- [x] 4.1 Create `src/app/_components/code-block-init.tsx` — client component hydrating copy buttons with clipboard API and "Copied!" feedback

## 5. Blog Search Index — /blog route

- [x] 5.1 Create `src/app/_components/blog-card.tsx` — card with cover image, title, date, tags, excerpt
- [x] 5.2 Create `src/app/_components/blog-filters.tsx` — year and tag chip filters with AND composition
- [x] 5.3 Create `src/app/_components/blog-search.tsx` — debounced search input using Fuse.js
- [x] 5.4 Create `src/app/_components/blog-page-client.tsx` — client component composing search, filters, and paginated card grid
- [x] 5.5 Create `src/app/blog/page.tsx` — server component building Fuse index at build time and passing serialized index to client

## 6. Code Section — /codigo routes

- [x] 6.1 Create `src/lib/projects.ts` — getProjectSlugs, getProjectBySlug, getAllProjects, getProjectReadme
- [x] 6.2 Create `src/app/_components-code/project-card.tsx` — card with title, description, tech badges
- [x] 6.3 Create `src/app/codigo/page.tsx` — project listing grid
- [x] 6.4 Create `src/app/codigo/[slug]/page.tsx` — project info page with README rendering and demo link
- [x] 6.5 Create `src/app/codigo/[slug]/demo/page.tsx` — dynamic import of `_projects/<slug>/page` demo component
- [x] 6.6 Create `_projects/example/meta.md` — example project frontmatter
- [x] 6.7 Create `_projects/example/page.tsx` — example demo component ("Hola Mundo")
- [x] 6.8 Create `_projects/example/readme.md` — example project documentation

## 7. API Routes

- [x] 7.1 Create `src/app/api/posts/route.ts` — GET with optional year and tag filters
- [x] 7.2 Create `src/app/api/projects/route.ts` — GET all projects
- [x] 7.3 Create `src/app/api/projects/[slug]/route.ts` — GET single project with 404 handling
- [x] 7.4 Create `src/app/api/search/route.ts` — GET with `?q=` query using Fuse.js

## 8. Testing

- [x] 8.1 Create `tests/unit/api.test.ts` — test getAllPosts, getPostBySlug, getAllTags, buildTree
- [x] 8.2 Create `tests/unit/markdownToHtml.test.ts` — test heading IDs and code block wrapper
- [x] 8.3 Create `tests/unit/search.test.ts` — test buildSearchIndex and searchPosts with filters
- [x] 8.4 Create `tests/unit/projects.test.ts` — test getProjectBySlug and getAllProjects
- [x] 8.5 Create `tests/unit/date-formatter.test.ts` — test date formatting
- [x] 8.6 Create `tests/components/post-header.test.tsx` — test rendering with props
- [x] 8.7 Create `tests/components/cover-image.test.tsx` — test rendering and null state
- [x] 8.8 Create `tests/components/blog-card.test.tsx` — test card rendering
- [x] 8.9 Create `tests/integration/navigation.spec.ts` — Playwright test for Home → Blog → Article → Codigo flow
- [x] 8.10 Add test scripts to `package.json` (test, test:watch, test:e2e, coverage)
