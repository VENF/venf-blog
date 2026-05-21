## Why

The blog currently has a `/api/form-streamer` SSE endpoint that generates form definitions via LLM, but there is no client-side infrastructure to consume it. Building a streaming form-builder unlocks dynamic, AI-generated forms that render in real-time as the LLM streams JSON tokens. This transforms the static blog into a platform capable of generating interactive experiences on demand.

Users describe what fields they need in natural language ("a contact form with name, email, and password"), and the system generates a validated, interactive form with zero manual markup.

## What Changes

- **Two-agent LLM pipeline**: Agent 1 (Analyzer) interprets the user's prompt, detects ambiguity, and produces a structured field specification. Agent 2 (Generator) consumes that specification and streams JSON tokens.
- **Partial JSON parser**: A stateless, streaming-tolerant parser that extracts complete sub-structures from incomplete JSON. The client renders fields as soon as they are structurally complete, without waiting for the full stream.
- **XState orchestration machine**: High-level deterministic states (idle → connecting → analyzing → generating → validating → interactive → submitting → complete) with error recovery. Internal sub-states managed by Zustand + reducers.
- **Zustand stores**: `streamStore` (buffer + parser state) and `formStore` (fields, schema, value/error tracking) using the existing Zustand v5 dependency.
- **Pluggable field registry**: Each field type (text, email, textarea, select, checkbox) is a self-contained plugin with its own React component, skeleton, Zod schema builder, and default value. New field types can be added by registering a plugin — no core changes needed.
- **react-hook-form + Zod integration**: After the stream completes, the generated schema is used to bootstrap a react-hook-form instance with full validation.
- **Ambiguity feedback loop**: When Agent 1 detects insufficient information (e.g., missing field types), it returns a question to the user. The user answers via a new POST to the same endpoint, and the pipeline retries.

## Capabilities

### New Capabilities

- `streaming-form`: Core form-builder capability. LLM generates forms via streaming JSON, rendered in real-time with partial-parse tolerance. Supports text, email, textarea, select, and checkbox fields with Zod validation.
- `agent-analyzer`: First LLM agent that interprets user prompts, determines field requirements, detects ambiguity, and returns structured AnalysisResult or AmbiguousResponse.
- `agent-generator`: Second LLM agent that consumes AnalysisResult and generates form JSON via streaming SSE.
- `partial-json-parser`: Stateless streaming JSON parser that returns best-effort partial objects from incomplete token buffers.
- `form-field-plugins`: Pluggable registry system for field type components, each with its own rendering, skeleton, Zod schema builder, and default value.

## Impact

- **Architecture**: New `src/features/streaming-form/` directory with machine, stores, parser, plugins, components, and hooks. New `prompts/form-builder/` directory with system prompts for both agents.
- **Dependencies added**: `xstate`, `@xstate/react` (production); `react-hook-form`, `@hookform/resolvers` (production).
- **Existing endpoint modified**: `src/app/api/form-streamer/route.ts` updated to support POST with prompt/history, two-agent pipeline, and SSE streaming.
- **No breaking changes**: Existing functionality unchanged. The form-builder lives in its own feature namespace.
