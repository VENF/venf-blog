import type { AnalyzerOutput } from './types'

export function mockAnalyzePrompt(_prompt: string): AnalyzerOutput {
  return {
    status: 'clear',
    title: 'Formulario de Contacto',
    submitLabel: 'Enviar Mensaje',
    fields: [
      {
        name: 'nombre',
        type: 'text',
        label: 'Nombre Completo',
        placeholder: 'Escribe tu nombre',
        required: true,
      },
      {
        name: 'email',
        type: 'email',
        label: 'Correo Electrónico',
        placeholder: 'ejemplo@correo.com',
        required: true,
      },
      {
        name: 'asunto',
        type: 'text',
        label: 'Asunto',
        placeholder: 'Motivo de tu contacto',
        required: false,
      },
      {
        name: 'mensaje',
        type: 'textarea',
        label: 'Mensaje',
        placeholder: 'Escribe tu mensaje aquí',
        required: true,
      },
    ],
    question: null,
    reasoning: null,
    context: null,
  }
}

export function mockAnalyzeAmbiguous(_prompt: string): AnalyzerOutput {
  return {
    status: 'ambiguous',
    title: '',
    submitLabel: '',
    fields: [],
    question:
      '¿Qué campos te gustaría que tuviera el formulario de contacto? Por ejemplo: Nombre, Correo electrónico y Mensaje.',
    reasoning:
      'El usuario solicitó un formulario de contacto pero no especificó qué campos desea incluir, ni el título o el texto del botón.',
    context: {
      knownFields: [],
      missingInfo: ['campos del formulario', 'título del formulario', 'texto del botón de envío'],
    },
  }
}
