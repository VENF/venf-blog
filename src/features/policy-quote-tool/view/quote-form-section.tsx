'use client'

import useSWR from 'swr'
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { fetchPlans, submitQuote } from '../api/quote-api'
import { PersonalInfo } from '../components/personal-info'
import { GroupMembers } from '../components/group-members'
import { PlanSelector } from '../components/plan-selector'
import { MaternityOptions } from '../components/maternity-options'
import { QuoteInvoice } from '../components/quote-invoice'
import { FormSkeleton } from '../components/form-skeleton'
import { useQuoteStore } from '../store/quote.store'
import { PlansData, Role } from '../store/schemas'

const MAX_GROUP_SIZE = 10

const transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

const blurVariants = {
  initial: { opacity: 0, filter: 'blur(4px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(4px)' },
}

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export interface FormValues {
  applicant: string
  email: string
  phone: string
  group: { role: string; age: number }[]
  company: string
  plan: string
  sumInsured: number
  includesMaternity: boolean
  maternitySum: string
  continuity: boolean
}

export function QuoteFormSection() {
  const { result, error, loading, setResult, setError, setLoading, reset } = useQuoteStore()

  const { data: plansData, error: plansError } = useSWR<PlansData>('engine-plans', () =>
    fetchPlans().then((res) => {
      if (!res.ok) throw new Error(res.error.message)
      return res.data
    })
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      applicant: '',
      email: '',
      phone: '',
      group: [{ role: 'TITULAR', age: 28 }],
      company: '',
      plan: '',
      sumInsured: 0,
      includesMaternity: false,
      maternitySum: '',
      continuity: false,
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'group' })

  const selectedCompany = useWatch({ control, name: 'company' })
  const selectedPlan = useWatch({ control, name: 'plan' })
  const includesMaternity = useWatch({ control, name: 'includesMaternity' })

  const filteredPlans =
    plansData && selectedCompany ? (plansData.companyPlans[selectedCompany] ?? []) : []

  const availableSums = plansData && selectedPlan ? (plansData.sumsByPlan[selectedPlan] ?? []) : []

  const showMaternity =
    plansData && selectedPlan ? plansData.plansWithMaternity.includes(selectedPlan) : false

  const canAddMember = fields.length < MAX_GROUP_SIZE

  const onSubmit = async (data: FormValues) => {
    reset()
    setLoading(true)

    const res = await submitQuote({
      applicant: data.applicant,
      email: data.email,
      phone: data.phone,
      group: data.group.map((m) => ({
        role: m.role as Role,
        age: Number(m.age),
      })),
      plan: data.plan,
      company: data.company,
      sumInsured: Number(data.sumInsured),
      includesMaternity: data.includesMaternity,
      maternitySum: data.includesMaternity ? Number(data.maternitySum) : undefined,
      continuity: data.continuity,
    })

    if (!res.ok) {
      setError(res.error.message)
      setLoading(false)
      return
    }

    setResult(res.data)
    setLoading(false)
  }

  const showResult = !!result
  const showLoading = !plansData && !plansError && !result
  const showError = !!plansError && !result
  const showForm = !!plansData && !plansError && !result

  return (
    <AnimatePresence mode="wait">
      {showResult && (
        <motion.div
          key="result"
          className="z-2 mx-auto max-w-2xl"
          variants={blurVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <QuoteInvoice result={result} onReset={reset} />
        </motion.div>
      )}

      {showForm && (
        <motion.div
          key="form"
          variants={blurVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="z-2"
        >
          <div className="z-2">
            <div className="z-2 mx-auto w-[555px] flex max-w-2xl flex-col rounded-[12px] bg-background p-6 shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <PersonalInfo register={register} control={control} errors={errors} />

                <GroupMembers
                  fields={fields}
                  append={append}
                  remove={remove}
                  roles={plansData.validRoles}
                  canAddMember={canAddMember}
                  maxSize={MAX_GROUP_SIZE}
                />

                <PlanSelector
                  control={control}
                  errors={errors}
                  selectedCompany={selectedCompany}
                  filteredPlans={filteredPlans}
                  availableSums={availableSums}
                  companies={Object.keys(plansData.companyPlans)}
                />

                <MaternityOptions
                  register={register}
                  control={control}
                  errors={errors}
                  includesMaternity={includesMaternity}
                  showMaternity={showMaternity}
                />

                <div className="flex items-center gap-3">
                  <Controller
                    name="continuity"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="continuity"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <label htmlFor="continuity" className="text-sm">
                    Continuidad
                  </label>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button className="h-[40px]" type="submit" disabled={loading}>
                  {loading ? 'Cotizando...' : 'Cotizar'}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {showLoading && (
        <motion.div
          key="loading"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <FormSkeleton />
        </motion.div>
      )}

      {showError && (
        <motion.div
          key="error"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          <div className="mx-auto flex min-h-svh max-w-2xl items-center justify-center p-6">
            <p className="text-destructive">{plansError.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
