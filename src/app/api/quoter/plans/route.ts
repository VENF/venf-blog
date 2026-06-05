import { apiRoute } from '@/lib/server-errors'
import {
  SUMS_BY_PLAN,
  PLANS_WITH_MONTHLY,
  PLAN_COMPANY,
  PLANS_WITH_MATERNITY,
  VALID_ROLES,
} from '../rates'

export const GET = apiRoute(async () => {
  const companies = [...new Set(Object.values(PLAN_COMPANY))]

  const companyPlans: Record<string, string[]> = {}
  for (const plan of Object.keys(PLAN_COMPANY)) {
    const company = PLAN_COMPANY[plan]
    if (!companyPlans[company]) companyPlans[company] = []
    companyPlans[company].push(plan)
  }

  return Response.json({
    companies,
    companyPlans,
    sumsByPlan: SUMS_BY_PLAN,
    plansWithMaternity: PLANS_WITH_MATERNITY,
    plansWithMonthly: PLANS_WITH_MONTHLY,
    validRoles: VALID_ROLES,
  })
})
