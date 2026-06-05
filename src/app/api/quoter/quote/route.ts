import z from 'zod'
import { calculateQuote } from '../calculator'
import { apiRoute, tryCatch } from '@/lib/server-errors'

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

const RoleSchema = z.enum(VALID_ROLES)

const PersonSchema = z.object({
  role: RoleSchema,
  age: z.number().int().positive(),
})

const QuoteInputSchema = z.object({
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

export const POST = apiRoute(async (req: Request) => {
  const body = await req.json()

  const parsed = QuoteInputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const result = await tryCatch(async () => calculateQuote(parsed.data))

  if (!result.ok) {
    return result.error.toResponse()
  }

  return Response.json(result.data)
})
