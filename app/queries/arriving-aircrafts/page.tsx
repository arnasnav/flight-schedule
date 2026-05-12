import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { ArrivingAircraftsPage } from "@/components/queries/pages/arriving-aircrafts-page"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <ArrivingAircraftsPage airports={airports ?? []} />
}
