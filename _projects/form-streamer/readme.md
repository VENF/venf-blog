Generador de formularios que usa IA para analizar un prompt en lenguaje natural, generar la estructura del formulario y transmitir los campos vía SSE en tiempo real. El usuario ve los campos aparecer progresivamente mientras la IA los produce, y puede interactuar con ellos inmediatamente.

## Workflow

```
Usuario escribe prompt
        │
        ▼
  POST /api/form-streamer/analyze
        │
        ├─ analyzePrompt(prompt)   [Gemini structured output]
        │    └─ status: ambiguous? → JSON con pregunta al usuario → FeedbackPanel
        │
        ├─ generateFormStream()    [Gemini streaming]
        │    └─ SSE chunks → parsedPartial → FormStore upsertFields
        │
        └─ FormRenderer (grid CSS 12 cols)
              └─ DynamicField × field (plugin.component)
                    └─ onChange → FormStore.setValue
```

## Stack

- **Next.js 16**
- **ai SDK v6**
- **Zustand**
- **react-hook-form** + zod
- **Tailwind CSS v4**
- **motion**
- **Radix UI**

---

- **Pipeline unificado**: analyze + generate en un solo POST, retorna SSE directo. Simplifica el cliente y elimina latencia de llamada intermedia.
- **Grid col-span por campo**: cada campo declara `colSpan` (1-12, default 12). CSS grid `grid-cols-12` maneja el layout sin filas explícitas.
- **Plugins registrados**: cada tipo de input es un `FieldPlugin` independiente (`component`, `skeleton`, `buildSchema`, `defaultValue`). El `fieldRegistry` los resuelve por tipo.
- **Streaming progresivo**: el SSE emite chunks JSON que se parsean parcialmente. Los campos aparecen en cuanto la IA los produce, sin esperar el JSON completo.

---

| Decisión                 | Pros                                            | Contras                                                            |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| Streaming progresivo     | UX inmediata, sin pantalla de carga             | El parseo parcial puede mostrar campos incompletos momentáneamente |
| Gemini structured output | Tipado fuerte, evita parsing libre              | Mayor latencia (~11s analyze) vs generación de texto plano         |
| Grid 12 columnas         | Layout predecible, responsive sin media queries | No soporta layouts anidados o filas complejas sin extender         |
| SSE en POST (no GET)     | Una sola conexión, sin sesiones en servidor     | No permite reconexión si se cae el stream                          |
| Cada plugin es aislado   | Fácil agregar/quitar tipos                      | Código repetitivo entre plugins similares                          |
