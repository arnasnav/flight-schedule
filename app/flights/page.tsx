import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import { Flights } from "@/components/queries/flights"
import { getApi } from "@/utils/server-api"

export default async function Page() {
  const [airports, companies] = await Promise.all([
    getApi<IAirport[]>("/api/airports"),
    getApi<ICompany[]>("/api/companies"),
  ])
  return <Flights airports={airports ?? []} companies={companies ?? []} />
}
