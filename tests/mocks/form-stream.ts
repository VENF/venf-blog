const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const MOCK_CHUNKS = [
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"{\\"title\\":\\"Formulario de Contacto\\",\\"fields\\":[{\\""},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"name\\":\\"nombre\\",\\"type\\":\\"text\\",\\"label\\":\\"Nombre Completo\\",\\"placeholder\\":\\"Escribe tu nombre\\",\\"required\\":true},{\\""},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"name\\":\\"email\\",\\"type\\":\\"email\\",\\"label\\":\\"Correo Electrónico\\",\\"placeholder\\":\\"ejemplo@correo.com\\",\\"required"},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"\\":true},{\\"name\\":\\"asunto\\",\\"type\\":\\"text\\",\\"label\\":\\"Asunto\\",\\"placeholder\\":\\"Motivo de tu contacto"},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"\\",\\"required\\":false},{\\"name\\":\\"mensaje\\",\\"type\\":\\"textarea\\",\\"label\\":\\"Mensaje\\",\\"placeholder\\":\\"Escribe tu mensaje"},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" aquí\\",\\"required\\":true}],\\"submitLabel\\":\\"Enviar Mensaje\\"}"},"finish_reason":null}]}`,
  `{"id":"chat-mock-1","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}`,
  '[DONE]',
]

export async function* mockFormStream(): AsyncGenerator<string> {
  for (const chunk of MOCK_CHUNKS) {
    yield chunk
    await sleep(2000)
  }
}
