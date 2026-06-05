import { RATES, MATERNITY_RATES, SUMS_BY_PLAN, PLANS_WITH_MONTHLY } from './rates'

export const VALID_ROLES = [
  'TITULAR',
  'CONYUGE',
  'HIJO(A)',
  'PADRE',
  'MADRE',
  'BENF1',
  'BENF2',
  'BENF3',
  'BENF4',
] as const

export type ValidRole = (typeof VALID_ROLES)[number]

export interface Person {
  role: string
  age: number
}

export interface QuoteInput {
  applicant: string
  email: string
  phone: string
  group: Person[]
  plan: string
  company: string
  sumInsured: number
  includesMaternity: boolean
  maternitySum?: number
  continuity: boolean
}

export interface PaymentOptions {
  annual: number
  semiannual: number
  quarterly: number
  monthly: number | null
}

export interface QuoteOutput {
  date: string
  applicant: string
  email: string
  phone: string
  company: string
  plan: string
  sumInsured: number
  continuity: boolean
  includesMaternity: boolean
  maternitySum?: number
  group: { role: string; age: number; premium: number }[]
  maternityPremium: number
  total: number
  paymentOptions: PaymentOptions
}

export function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function findRate(plan: string, age: number, sum: number): number {
  const entries = RATES[plan]
  if (!entries) {
    throw new Error(`Plan "${plan}" not found in rates`)
  }
  const entry = entries.find((e) => e.sum === sum)
  if (!entry) {
    throw new Error(
      `Sum insured ${sum} not available for plan "${plan}". ` +
        `Available sums: ${SUMS_BY_PLAN[plan]?.join(', ')}`
    )
  }
  const band = entry.bands.find((b) => age >= b.from && age <= b.to)
  if (!band) {
    const allBands = entry.bands.map((b) => `${b.from}-${b.to}`).join(', ')
    throw new Error(
      `Age ${age} out of range for plan "${plan}" with sum ${sum}. ` +
        `Available bands: ${allBands}`
    )
  }
  if (band.premium === 0) {
    throw new Error(
      `Plan "${plan}" with sum ${sum} is not available for age ${age}. ` +
        `Available bands: ${entry.bands
          .filter((b) => b.premium > 0)
          .map((b) => `${b.from}-${b.to}`)
          .join(', ')}`
    )
  }
  return band.premium
}

function findMaternityRate(company: string, plan: string, sum: number): number {
  const entry = MATERNITY_RATES.find(
    (m) => m.company === company && m.plan === plan && m.sum === sum
  )
  if (!entry) {
    const available = MATERNITY_RATES.filter((m) => m.company === company && m.plan === plan).map(
      (m) => m.sum
    )
    throw new Error(
      `Maternity combination not supported for "${company}" / "${plan}" ` +
        `with sum ${sum}. Available sums: ${available.join(', ') || 'none'}`
    )
  }
  return entry.premium
}

function buildPaymentOptions(plan: string, total: number): PaymentOptions {
  return {
    annual: total,
    semiannual: total / 2,
    quarterly: total / 4,
    monthly: PLANS_WITH_MONTHLY.includes(plan) ? total / 12 : null,
  }
}

export function calculateQuote(input: QuoteInput, date?: string): QuoteOutput {
  if (!RATES[input.plan]) {
    throw new Error(
      `Plan "${input.plan}" does not exist. Available plans: ${Object.keys(RATES).join(', ')}`
    )
  }

  const availableSums = SUMS_BY_PLAN[input.plan]
  if (!availableSums.includes(input.sumInsured)) {
    throw new Error(
      `Sum insured ${input.sumInsured} not available for plan "${input.plan}". ` +
        `Accepted values: ${availableSums.join(', ')}`
    )
  }

  const group: { role: string; age: number; premium: number }[] = []

  for (const person of input.group) {
    if (!VALID_ROLES.includes(person.role as ValidRole)) {
      throw new Error(`Role "${person.role}" is invalid. Valid roles: ${VALID_ROLES.join(', ')}`)
    }
    if (person.age <= 0) {
      throw new Error(`Invalid age for "${person.role}": must be greater than 0`)
    }
    const premium = findRate(input.plan, person.age, input.sumInsured)
    group.push({ role: person.role, age: person.age, premium })
  }

  let maternityPremium = 0

  if (input.includesMaternity) {
    if (input.maternitySum === undefined || input.maternitySum === null) {
      throw new Error('Must specify maternitySum when includesMaternity is true')
    }
    maternityPremium = findMaternityRate(input.company, input.plan, input.maternitySum)
  }

  const total = group.reduce((acc, p) => acc + p.premium, 0) + maternityPremium

  return {
    date: date ?? new Date().toISOString(),
    applicant: input.applicant,
    email: input.email,
    phone: input.phone,
    company: input.company,
    plan: input.plan,
    sumInsured: input.sumInsured,
    continuity: input.continuity,
    includesMaternity: input.includesMaternity,
    maternitySum: input.includesMaternity ? input.maternitySum : undefined,
    group,
    maternityPremium,
    total,
    paymentOptions: buildPaymentOptions(input.plan, total),
  }
}
