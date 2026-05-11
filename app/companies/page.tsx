import { Companies } from "@/components/companies/company"
import { getApi } from "@/utils/server-api"
import type { ICompany } from "@/models/company-model"

export default async function Page() {
  const companies = await getApi<ICompany[]>("/api/companies")
  return <Companies companies={companies ?? []} />
}
