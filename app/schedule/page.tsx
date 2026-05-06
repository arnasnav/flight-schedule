import { Schedule } from "@/components/schedule/schedule-page"
import { getApi } from "@/utils/server-api"
import { ISchedule } from "@/models/schedule-model"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"

export default async function Page() {
  const [schedules, airports, companies] = await Promise.all([
    getApi<ISchedule[]>("/api/schedule"),
    getApi<IAirport[]>("/api/airports"),
    getApi<ICompany[]>("/api/companies"),
  ])

  return (
    <Schedule
      initialSchedules={schedules ?? []}
      airports={airports ?? []}
      companies={companies ?? []}
    />
  )
}
