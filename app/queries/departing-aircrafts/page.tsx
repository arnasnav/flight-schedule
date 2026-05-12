import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { DepartingAircraftsPage } from "@/components/queries/pages/departing-aircrafts-page"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <DepartingAircraftsPage airports={airports ?? []} />
}
