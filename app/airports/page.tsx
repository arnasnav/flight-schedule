import { Airports } from "@/components/flights/airport"
import { getApi } from "@/utils/server-api"
import { IAirport } from "@/models/airport-model"

export default async function Page() {
  const airport = await getApi<IAirport[]>("/api/airports")
  return <Airports airports={airport ?? []} />
}
