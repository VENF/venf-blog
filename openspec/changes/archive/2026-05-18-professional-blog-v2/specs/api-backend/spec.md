## ADDED Requirements

### Requirement: GET /api/posts

The `/api/posts` route SHALL return all posts as JSON, with the `content` field excluded from the response. It SHALL support optional `?year=` and `?tag=` query parameters for filtering.

#### Scenario: Returns all posts without content

- **WHEN** a GET request is made to `/api/posts`
- **THEN** the response SHALL be a JSON array of all posts without the `content` field

#### Scenario: Filters by year

- **WHEN** a GET request is made to `/api/posts?year=2023`
- **THEN** the response SHALL only include posts whose `date` starts with "2023"

#### Scenario: Filters by tag

- **WHEN** a GET request is made to `/api/posts?tag=hexagonal`
- **THEN** the response SHALL only include posts whose `tags` array includes "hexagonal"

### Requirement: GET /api/projects

The `/api/projects` route SHALL return all projects as JSON.

#### Scenario: Returns all projects

- **WHEN** a GET request is made to `/api/projects`
- **THEN** the response SHALL be a JSON array of all projects

### Requirement: GET /api/projects/[slug]

The `/api/projects/<slug>` route SHALL return a single project's metadata as JSON, or 404 if not found.

#### Scenario: Returns project metadata

- **WHEN** a GET request is made to `/api/projects/example`
- **THEN** the response SHALL be the JSON metadata for that project

#### Scenario: Returns 404 for unknown project

- **WHEN** a GET request is made to `/api/projects/unknown`
- **THEN** the response SHALL have status 404 with `{ "error": "Not found" }`

### Requirement: GET /api/search

The `/api/search` route SHALL accept a `?q=` query parameter and return matching posts as JSON, using Fuse.js search against title, excerpt, and tags.

#### Scenario: Searches posts by query

- **WHEN** a GET request is made to `/api/search?q=hexagonal`
- **THEN** the response SHALL be a JSON array of posts matching "hexagonal"

### Requirement: DynamoDB multi-table client template

The `lib/dynamodb.ts` SHALL export a `createTableClient(tableName)` factory function. The returned client SHALL support `get`, `put`, `query`, `update`, and `delete` operations. The AWS region and optional endpoint SHALL be configurable via `AWS_REGION` and `AWS_ENDPOINT` environment variables. The client SHALL use the DynamoDB single-table pattern per `tableName`.

#### Scenario: Table client performs get operation

- **WHEN** `createTableClient('Projects').get('pk-value')` is called
- **THEN** a DynamoDB GetCommand SHALL be executed against the 'Projects' table

### Requirement: Redis client template

The `lib/redis.ts` SHALL export a `getCache()` function returning a cache object with `get`, `set`, and `del` methods. The Redis URL SHALL be configurable via `REDIS_URL` environment variable. If `REDIS_URL` is not set, all cache operations SHALL return null/no-op gracefully. The client SHALL use lazy connection.

#### Scenario: Cache gracefully defaults to no-op

- **WHEN** `REDIS_URL` is not set and `getCache().get('key')` is called
- **THEN** the result SHALL be `null` with no connection error thrown
