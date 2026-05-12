import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { FlightsFromAirport } from "@/components/queries/flights-from-airport"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <FlightsFromAirport airports={airports ?? []} />
}
