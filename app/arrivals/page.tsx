import { Arrivals } from "@/components/arrivals/arrival"
import { getApi } from "@/utils/server-api"
import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"

export default async function Page() {
  const [schedules, airports, companies] = await Promise.all([
    getApi<ISchedule[]>("/api/schedules"),
    getApi<IAirport[]>("/api/airports"),
    getApi<ICompany[]>("/api/companies"),
  ])

  return (
    <Arrivals
      schedules={schedules ?? []}
      airports={airports ?? []}
      companies={companies ?? []}
    />
  )
}