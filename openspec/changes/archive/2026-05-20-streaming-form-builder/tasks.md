## Execution Rules

- Each phase is a minimum deliverable: self-contained, testable, and auditable.
- You must NOT advance beyond a phase without explicit approval.
- You must NOT install dependencies — list them and ask the user.
- You must NOT start the dev server — the user handles that.
- Each phase includes tests. Mocks for LLM calls must be defined before tests.
- After completing a phase: stop, summarize what was done, and wait for review.
- Implementation order follows phases. Within a phase, tasks inside a group block can be done in any order.

## Dependencies needed

Ask user to install before Phase 2:

- `xstate` + `@xstate/react`

Ask user to install before Phase 5:

- `react-hook-form` + `@hookform/resolvers`

---

## Phase 1 — Partial JSON Parser

Build the stateless streaming JSON parser. This is the foundation — all real-time rendering depends on it.

### Files to create

- `src/features/streaming-form/parser/partial-json-parser.ts` — Core parser
- `tests/unit/partial-json-parser.test.ts` — Unit tests

### Tests

- Complete JSON → returns `{ value, isComplete: true }` (same as JSON.parse)
- Object with truncated string → discards incomplete string, keeps complete pairs
- Array with incomplete items → keeps complete items, drops incomplete
- Nested objects with partial inner fields → keeps complete outer + complete inner fields
- Unterminated string → truncates to last complete string
- Empty string → returns `{ value: {}, isComplete: false }`
- Only whitespace → returns `{ value: {}, isComplete: false }`
- Buffer with trailing comma → sanitizes and parses
- Escaped characters inside strings → doesn't break parser state
- Multiple chunks accumulated → works same as single buffer (stateless)
- Array of objects, some complete → returns array with complete objects only

---

## Phase 2 — XState Machine

Install `xstate` + `@xstate/react` (ask user first). Define the high-level state machine.

### Files to create

- `src/features/streaming-form/machine/form.machine.ts` — XState machine definition with types
- `tests/unit/form.machine.test.ts` — Machine transition tests

### Tests

- idle → START → connecting
- connecting → CONNECTED → analyzing
- analyzing → CLEAR → generating
- analyzing → AMBIGUOUS → waiting_feedback
- waiting_feedback → FEEDBACK → analyzing
- generating → STREAM_DONE → validating
- validating → VALID → interactive
- interactive → SUBMIT → submitting
- submitting → SUCCESS → complete
- All states → ERROR → error (guard: error transitions work from any state)
- Invalid transitions are rejected (e.g., idle → generating directly)
- Context is properly initialized and updated

---

## Phase 3 — Zustand Stores + Field Registry

Build the two Zustand stores and the pluggable field type registry. Create all 5 field type plugins.

### Files to create

- `src/features/streaming-form/stores/stream-store.ts` — Stream buffer + parser state
- `src/features/streaming-form/stores/form-store.ts` — Fields, schema, value/error state
- `src/features/streaming-form/plugins/registry.ts` — FieldPlugin registry
- `src/features/streaming-form/plugins/types.ts` — FieldPlugin interface + shared types
- `src/features/streaming-form/plugins/text.plugin.ts`
- `src/features/streaming-form/plugins/email.plugin.ts`
- `src/features/streaming-form/plugins/textarea.plugin.ts`
- `src/features/streaming-form/plugins/select.plugin.ts`
- `src/features/streaming-form/plugins/checkbox.plugin.ts`
- `tests/unit/stream-store.test.ts`
- `tests/unit/form-store.test.ts`
- `tests/unit/field-registry.test.ts`

### Tests

**streamStore:**

- `push(chunk)` appends to buffer and triggers reparsing
- `parsedPartial` updates when new data is structurally complete
- `reset()` clears buffer and parsed state
- Multiple pushes accumulate correctly

**formStore:**

- `addFields(newFields)` merges new fields without duplicating by name
- `updateField(name, partial)` merges partial data into existing field
- `buildSchema()` returns Zod schema with correct types for each field plugin
- `setValue(name, value)` and `setError(name, error)` update field state
- `reset()` clears all fields and state

**fieldRegistry:**

- `register(plugin)` adds plugin to registry
- `get(type)` returns correct plugin or throws for unknown type
- Each plugin returns non-null `component`, `skeleton`, `buildSchema`, `defaultValue`
- `buildSchema()` for text returns `z.string()`, for email returns `z.string().email()`, for checkbox returns `z.boolean()`, for select returns `z.enum()`

---

## Phase 4 — Server-Side Agents + Prompts + API

Build the two-agent LLM pipeline. Create system prompts as `.md` files. Update the existing form-streamer endpoint.

### Files to create

- `prompts/form-builder/system-analyzer.md` — Agent 1 system prompt
- `prompts/form-builder/system-generator.md` — Agent 2 system prompt
- `src/app/api/form-streamer/agents/types.ts` — Shared types (AnalysisResult, AmbiguousResponse, etc.)
- `src/app/api/form-streamer/agents/analyzer.ts` — Agent 1 logic
- `src/app/api/form-streamer/agents/generator.ts` — Agent 2 logic
- `tests/mocks/analyzer-responses.ts` — Mock responses for Agent 1
- `tests/mocks/generator-stream.ts` — Mock stream tokens for Agent 2
- `tests/unit/analyzer.test.ts` — Tests for Agent 1
- `tests/unit/generator.test.ts` — Tests for Agent 2

### Files to modify

- `src/app/api/form-streamer/route.ts` — Update to POST, integrate agents, SSE streaming

### Tests

**Analyzer:**

- Clear prompt → returns `AnalysisResult` with correct fields
- Ambiguous prompt (missing types) → returns `AmbiguousResponse` with question
- Ambiguous prompt → response includes `context.knownFields` and `context.missingInfo`
- Empty prompt → returns ambiguous with clear question

**Generator:**

- Valid `AnalysisResult` → produces stream of JSON tokens
- Stream ends with complete, valid JSON
- Generator respects field types from AnalysisResult

**API Route:**

- POST with valid prompt → SSE stream with form JSON
- POST with ambiguous prompt → JSON response (not SSE) with question
- POST with `?mock=true` → returns mock SSE stream for testing
- Invalid request → returns appropriate error status

---

## Phase 5 — Client: react-hook-form + Canvas

Install `react-hook-form` + `@hookform/resolvers` (ask user first). Build the client-side rendering layer.

### Files to create

- `src/features/streaming-form/hooks/use-streaming-form.ts` — Unified hook (machine + stores + RHF)
- `src/features/streaming-form/components/streaming-form-shell.tsx` — Top-level orchestrator
- `src/features/streaming-form/components/form-canvas.tsx` — Renders title, fields, submit
- `src/features/streaming-form/components/dynamic-field.tsx` — Resolves plugin by type, renders component or skeleton
- `src/features/streaming-form/components/field-skeleton.tsx` — Per-type skeleton component
- `tests/components/streaming-form.test.tsx` — Component tests

### Tests

- `FormCanvas` renders title and fields from formStore
- `DynamicField` renders correct component for `text`, `email`, `textarea`, `select`, `checkbox`
- `DynamicField` renders skeleton when field is incomplete (missing label/placeholder)
- `StreamingFormShell` connects XState machine to stores
- During `generating`, fields appear progressively as data arrives
- After `interactive`, fields are editable and submit works
- Submit calls `console.log` with form values
- Validation errors appear on invalid submit
- Reset returns to idle state

---

## Phase 6 — Ambiguity Loop + Polish

Wire up the full user journey: prompt → ambiguous → feedback → clear → stream → interactive → submit. Handle edge cases and errors.

### Files to modify

- `src/features/streaming-form/components/streaming-form-shell.tsx` — Add ambiguity UI (question prompt + input)
- `src/features/streaming-form/hooks/use-streaming-form.ts` — Handle feedback loop

### Tests

- Full flow: prompt with missing types → ambiguous response → user answers → clear → form renders
- Error recovery: SSE disconnects mid-stream → machine enters error → retry accumulates buffer
- Multiple ambiguity rounds: user is vague multiple times → loop continues
- Server returns invalid JSON → validating fails → error → user can retry
- Timeout: LLM takes too long → error with timeout message
- All 5 field types render and validate correctly in end-to-end flow
