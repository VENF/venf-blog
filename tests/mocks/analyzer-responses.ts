import type { AnalyzerOutput } from '@/app/api/form-streamer/agents/types'

export const mockClearResponse: AnalyzerOutput = {
  status: 'clear',
  title: 'Contact Form',
  submitLabel: 'Send Message',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Write your message',
      required: true,
    },
  ],
  question: null,
  reasoning: null,
  context: null,
}

export const mockAmbiguousResponse: AnalyzerOutput = {
  status: 'ambiguous',
  title: '',
  submitLabel: '',
  fields: [],
  question:
    'What types of fields do you need? I see you mentioned "name" and "email" but I need to know the field types (text, email, textarea, select, checkbox).',
  reasoning: 'Field types not specified',
  context: {
    knownFields: ['name', 'email'],
    missingInfo: ['field types'],
  },
}

export const mockAmbiguousWithOptions: AnalyzerOutput = {
  status: 'ambiguous',
  title: '',
  submitLabel: '',
  fields: [],
  question: 'You mentioned a country selector. What options should the select field include?',
  reasoning: 'Select field options missing',
  context: {
    knownFields: ['name', 'email', 'country'],
    missingInfo: ['select options for country'],
  },
}
