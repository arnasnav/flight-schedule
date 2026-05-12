import type { ICompany } from "@/models/company-model"
import { getApi } from "@/utils/server-api"
import { FlightsByCompanyPage } from "@/components/queries/pages/flights-by-company-page"

export default async function Page() {
  const companies = await getApi<ICompany[]>("/api/companies")
  return <FlightsByCompanyPage companies={companies ?? []} />
}
