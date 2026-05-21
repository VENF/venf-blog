## Context

The existing stack is Next.js 16.2.5 / React 19.2.4 with Tailwind v4, shadcn/ui radix-nova style, `motion` for animations, and Zod v4 for validation. The app already has:

- `/api/form-streamer` SSE endpoint using Vercel AI SDK v6 with Google Gemini
- Complete shadcn/ui Field system (Field, Input, Textarea, Select, Checkbox, Label, etc.)
- Zustand v5 available as dependency (no stores implemented yet)
- Zod v4 available for schema validation
- Feature-Sliced Design path aliases defined (`@features/*`, `@shared/*`, etc.) but not yet used

## Goals / Non-Goals

**Goals:**

- Real-time rendering of LLM-generated forms as JSON streams arrive
- Two-agent pipeline: Analyze prompt for clarity, then generate form
- Ambiguity feedback loop when user prompt is insufficient
- Stateless partial JSON parser that recovers complete sub-structures
- XState machine for high-level deterministic orchestration (6+ states)
- Zustand stores for internal stream and form state
- Pluggable field type registry (text, email, textarea, select, checkbox)
- Server-side validation of LLM output before sending to client
- react-hook-form + Zod validation on the client after stream completes
- Full test coverage with mocks for all LLM interactions

**Non-Goals:**

- Not building a visual form editor (drag-and-drop, WYSIWYG)
- Not implementing conditional/advanced validation logic (only minLength, maxLength, pattern, required)
- Not persisting form submissions to a database (console.log only)
- Not supporting mobile-specific input types or file uploads
- Not an auth system or user accounts

## Decisions

### Decision 1: Two-agent LLM pipeline (Analyzer → Generator)

**Choice:** Two separate LLM calls: Agent 1 (Analyzer) interprets the user prompt and returns a structured `AnalysisResult` or `AmbiguousResponse`. Agent 2 (Generator) consumes `AnalysisResult` and streams the form JSON.

**Rationale:** Separating analysis from generation enables the ambiguity feedback loop. If the user says "nombre, email, contraseña" without specifying field types, Agent 1 can detect this and ask clarifying questions before Agent 2 attempts generation. This produces higher-quality forms and avoids mid-stream corrections.

**Alternatives considered:** Single agent that handles everything (rejected: no ambiguity detection, harder to debug). Streaming analysis (rejected: complex token-level state tracking for ambiguity on partial output).

### Decision 2: XState for high-level orchestration only

**Choice:** XState manages only the deterministic state machine (idle → connecting → analyzing → generating → validating → interactive → submitting → complete → error). Internal form state, stream buffer, and UI state are managed by Zustand + reducers.

**Rationale:** XState is being used to learn it, so we limit its scope to what it does best: explicit state transitions with guards. Zustand is already in the project and handles the chaotic, asynchronous stream state better.

**States:**

- `idle` — initial, before user submits a prompt
- `connecting` — opening SSE connection to the backend
- `analyzing` — Agent 1 processing the user prompt
- `waiting_feedback` — Agent 1 detected ambiguity, waiting for user input
- `generating` — Agent 2 streaming JSON (sub-states in Zustand: receiving, rendering)
- `validating` — verifying the complete JSON on server and client
- `interactive` — form is fully rendered and editable
- `submitting` — user submitted the form
- `complete` — submission successful
- `error` — any unrecoverable error

**Transitions:**

- `START` — idle → connecting
- `CONNECTED` — connecting → analyzing
- `CLEAR` — analyzing → generating
- `AMBIGUOUS` — analyzing → waiting_feedback
- `FEEDBACK` — waiting_feedback → analyzing
- `STREAM_DONE` — generating → validating
- `VALID` — validating → interactive
- `INVALID` — validating → error
- `SUBMIT` — interactive → submitting
- `SUCCESS` — submitting → complete
- `ERROR` — any state → error
- `RETRY` — error → idle

### Decision 3: Stateless partial JSON parser

**Choice:** A stateless parser that re-parses the entire accumulated buffer on each chunk. It attempts `JSON.parse()` first, then falls back to token-walking sanitization: closes unclosed braces/brackets, truncates incomplete strings, discards incomplete primitives.

**Rationale:** Simple, predictable, and no state-sync bugs. For a stream arriving every 30-100ms, re-parsing a 2KB buffer is computationally trivial in JavaScript. Stateful parsing would be more efficient but significantly harder to get right.

**Algorithm:**

1. Try `JSON.parse(buffer)` — if success, return `{ value, isComplete: true }`
2. Walk buffer character by character, tracking: `depth`, `inString`, `escapeNext`
3. Identify complete key-value pairs at depth 1
4. Sanitize: close unmatched braces/brackets, truncate unterminated strings
5. Try `JSON.parse(sanitized)` — if success, return `{ value, isComplete: false }`
6. Fallback: extract only structurally complete pairs

### Decision 4: Pluggable field registry

**Choice:** Each field type implements a `FieldPlugin` interface with `component`, `skeleton`, `buildSchema()`, `defaultValue`, and optional `serialize`/`parse`. Types are registered in a global `FieldRegistry` map.

```typescript
interface FieldPlugin {
  type: string
  component: React.ComponentType<FieldProps>
  skeleton: React.ComponentType
  buildSchema: (def: FieldDef) => ZodType
  defaultValue: any
}
```

**Rationale:** Adding a new field type means writing one plugin file and registering it. No switches, no conditionals, no changes to the form canvas or validation pipeline. The LLM only needs to emit the correct `type` string.

**Alternatives considered:** Switch-case in a single component (rejected: violates Open/Closed principle, grows unboundedly). Dynamic component resolution via string-to-component map in a single file (rejected: less discoverable, harder to test in isolation).

### Decision 5: POST + SSE for the API

**Choice:** The endpoint accepts POST with `{ prompt, history }` and returns either a JSON response (`{ status: "ambiguous", question }`) or an SSE stream of form JSON tokens.

**Rationale:** POST supports larger payloads than GET query params, enables passing feedback history for the ambiguity loop, and the SSE response provides real-time streaming for the generator case.

### Decision 6: Server-side validation of LLM output

**Choice:** Before streaming the generated JSON to the client, the server validates it against a known schema: field types exist in the registry, selects have options, required fields have names, title is non-empty, total fields ≤ 20. If invalid, the server can retry the LLM with error feedback.

**Rationale:** Catches hallucinations and malformed output before it reaches the client. Prevents rendering errors and provides a clean retry mechanism.

### Decision 7: react-hook-form for client-side form state

**Choice:** After the stream completes and XState enters `interactive`, a `z.infer` Zod schema is built from the field definitions, and react-hook-form is initialized with `zodResolver`. The shadcn Field system provides the visual layout (label, error, description).

**Rationale:** react-hook-form handles the complex state of dirty/touched/valid fields, provides a standard API for form submission, and integrates cleanly with Zod via `@hookform/resolvers`. The shadcn Field components handle layout without duplicating form logic.

### Decision 8: System prompts in `.md` files

**Choice:** The prompts for Agent 1 and Agent 2 live in `prompts/form-builder/system-analyzer.md` and `prompts/form-builder/system-generator.md`. They are read at request time.

**Rationale:** Prompts are content, not code. Separating them into markdown files enables better versioning, review, and maintenance. Team members can edit prompts without touching TypeScript files.

### Decision 9: Mock-first testing for LLM interactions

**Choice:** All LLM calls are mocked in tests. Dedicated mock files mirror the structure of real responses: `tests/mocks/analyzer-responses.ts` for Agent 1 outputs (clear and ambiguous), `tests/mocks/generator-stream.ts` for Agent 2 stream tokens.

**Rationale:** LLM calls are non-deterministic and expensive. Mocks provide fast, deterministic, and reliable test execution. They also serve as documentation of the expected response shapes.

## Risks / Trade-offs

- **[Risk] Stateless parser performance on large buffers** — Mitigation: buffers are small (< 50KB). If forms grow large, add a buffer cap with truncation warning.
- **[Risk] LLM hallucinates field types** — Mitigation: server-side validation rejects unknown types before they reach the client.
- **[Risk] XState + Zustand boundary confusion** — Mitigation: clear rule — XState handles transitions, Zustand handles data. The machine never holds form field state; stores never call transitions.
- **[Trade-off] Two-agent pipeline adds latency** — Two sequential LLM calls instead of one. Acceptable because the alternative (single agent with ambiguity mid-stream) produces worse UX.
- **[Risk] SSE connection drops mid-stream** — Mitigation: XState `error` state allows retry. The machine can reconnect from `generating` with the accumulated buffer to avoid regenerating.
- **[Risk] react-hook-form + Zod v4 compatibility** — `@hookform/resolvers` may not fully support Zod v4. Fallback: write a custom resolver that calls `schema.safeParse()` and maps errors manually.

## Open Questions

1. Should the system prompt files include explicit few-shot examples or just structural rules?
2. How should the ambiguity feedback loop handle multiple rounds (user keeps being vague)?
3. Should mock data for form generation use the real field registry or hardcoded field types?
