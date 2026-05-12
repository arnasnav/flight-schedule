import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { TransitAirportsPage } from "@/components/queries/transit-airports"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <TransitAirportsPage airports={airports ?? []} />
}
