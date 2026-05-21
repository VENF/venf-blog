import { createGoogleGenerativeAI } from '@ai-sdk/google'

export const google = createGoogleGenerativeAI({
  apiKey: 'AIzaSyCxQwNP2FmyNM-0EYe8cq5F4ZBMsLdANwg', //process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
})
