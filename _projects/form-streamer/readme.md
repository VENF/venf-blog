Generador de formularios que usa IA para analizar un prompt en lenguaje natural, generar la estructura del formulario y transmitir los campos vía SSE en tiempo real

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

...
