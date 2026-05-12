import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { FlightsFromAirportPage } from "@/components/queries/pages/flights-from-airport-page"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <FlightsFromAirportPage airports={airports ?? []} />
}
