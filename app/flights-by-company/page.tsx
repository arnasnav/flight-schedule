import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import { getApi } from "@/utils/server-api"
import { FlightsByCompany } from "@/components/queries/flights-by-company"

export default async function Page() {
  const [airports, companies] = await Promise.all([
    getApi<IAirport[]>("/api/airports"),
    getApi<ICompany[]>("/api/companies"),
  ])
  return <FlightsByCompany airports={airports ?? []} companies={companies ?? []} />
}
