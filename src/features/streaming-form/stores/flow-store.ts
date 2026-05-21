import { create } from 'zustand'

export type FlowStatus =
  | 'idle'
  | 'connecting'
  | 'analyzing'
  | 'waiting_feedback'
  | 'generating'
  | 'validating'
  | 'interactive'
  | 'submitting'
  | 'complete'
  | 'error'

export interface FlowState {
  status: FlowStatus
  prompt: string
  error: string | null
  question: string | null
  knownFields: string[]
  missingInfo: string[]

  start: (prompt: string) => void
  setConnected: () => void
  setClear: () => void
  setAmbiguous: (question: string, knownFields: string[], missingInfo: string[]) => void
  sendFeedback: () => void
  setStreamDone: () => void
  setValid: () => void
  setInvalid: (error: string) => void
  setSubmitting: () => void
  setSuccess: () => void
  setError: (error: string) => void
  retry: () => void
}

export const useFormFlowStore = create<FlowState>((set, get) => ({
  status: 'idle',
  prompt: '',
  error: null,
  question: null,
  knownFields: [],
  missingInfo: [],

  start: (prompt: string) => {
    if (get().status !== 'idle') return
    set({
      status: 'connecting',
      prompt,
      error: null,
      question: null,
      knownFields: [],
      missingInfo: [],
    })
  },

  setConnected: () => {
    if (get().status !== 'connecting') return
    set({ status: 'analyzing' })
  },

  setClear: () => {
    if (get().status !== 'analyzing') return
    set({ status: 'generating' })
  },

  setAmbiguous: (question: string, knownFields: string[], missingInfo: string[]) => {
    if (get().status !== 'analyzing') return
    set({ status: 'waiting_feedback', question, knownFields, missingInfo })
  },

  sendFeedback: () => {
    if (get().status !== 'waiting_feedback') return
    set({ status: 'analyzing', question: null })
  },

  setStreamDone: () => {
    if (get().status !== 'generating') return
    set({ status: 'validating' })
  },

  setValid: () => {
    if (get().status !== 'validating') return
    set({ status: 'interactive' })
  },

  setInvalid: (error: string) => {
    if (get().status !== 'validating') return
    set({ status: 'error', error })
  },

  setSubmitting: () => {
    if (get().status !== 'interactive') return
    set({ status: 'submitting' })
  },

  setSuccess: () => {
    if (get().status !== 'submitting') return
    set({ status: 'complete' })
  },

  setError: (error: string) => {
    set({ status: 'error', error })
  },

  retry: () => {
    if (get().status !== 'error') return
    set({
      status: 'idle',
      error: null,
      question: null,
      knownFields: [],
      missingInfo: [],
    })
  },
}))
