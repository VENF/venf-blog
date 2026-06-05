export interface AgeBand {
  from: number
  to: number
  premium: number
}

export interface RateEntry {
  sum: number
  bands: AgeBand[]
}

export interface MaternityEntry {
  company: string
  plan: string
  sum: number
  premium: number
}
