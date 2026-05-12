import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { DepartingAircrafts } from "@/components/queries/departing-aircrafts"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <DepartingAircrafts airports={airports ?? []} />
}
