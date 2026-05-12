import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { TransitAirports } from "@/components/queries/transit-airports"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <TransitAirports airports={airports ?? []} />
}
