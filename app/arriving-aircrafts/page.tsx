import type { IAirport } from "@/models/airport-model"
import { getApi } from "@/utils/server-api"
import { ArrivingAircrafts } from "@/components/queries/arriving-aircrafts"

export default async function Page() {
  const airports = await getApi<IAirport[]>("/api/airports")
  return <ArrivingAircrafts airports={airports ?? []} />
}
