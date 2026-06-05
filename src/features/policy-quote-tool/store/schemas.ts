import { z } from 'zod'

export const PlansDataSchema = z.object({
  companies: z.array(z.string()),
  companyPlans: z.record(z.string(), z.array(z.string())),
  sumsByPlan: z.record(z.string(), z.array(z.number())),
  plansWithMaternity: z.array(z.string()),
  plansWithMonthly: z.array(z.string()),
  validRoles: z.array(z.string()),
})
export type PlansData = z.infer<typeof PlansDataSchema>

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

export const RoleSchema = z.enum(VALID_ROLES)
export type Role = z.infer<typeof RoleSchema>

export const PersonSchema = z.object({
  role: RoleSchema,
  age: z.number().int().positive(),
})
export type Person = z.infer<typeof PersonSchema>

export const QuoteInputSchema = z.object({
  applicant: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  group: z.array(PersonSchema).min(1),
  plan: z.string().min(1),
  company: z.string().min(1),
  sumInsured: z.number().positive(),
  includesMaternity: z.boolean(),
  maternitySum: z.number().positive().optional(),
  continuity: z.boolean(),
})
export type QuoteInput = z.infer<typeof QuoteInputSchema>

export const PaymentOptionsSchema = z.object({
  annual: z.number(),
  semiannual: z.number(),
  quarterly: z.number(),
  monthly: z.number().nullable(),
})
export type PaymentOptions = z.infer<typeof PaymentOptionsSchema>

export const QuoteOutputSchema = z.object({
  date: z.string(),
  applicant: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.string(),
  plan: z.string(),
  sumInsured: z.number(),
  continuity: z.boolean(),
  includesMaternity: z.boolean(),
  maternitySum: z.number().optional(),
  group: z.array(
    z.object({
      role: z.string(),
      age: z.number(),
      premium: z.number(),
    })
  ),
  maternityPremium: z.number(),
  total: z.number(),
  paymentOptions: PaymentOptionsSchema,
})
export type QuoteOutput = z.infer<typeof QuoteOutputSchema>
