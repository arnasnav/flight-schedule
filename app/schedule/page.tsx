import { Schedule } from "@/components/schedule/schedule"
import { getApi } from "@/utils/server-api"
import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { IStatus } from "@/models/status-model"

export default async function Page() {
  const [schedules, airports, companies, statuses] = await Promise.all([
    getApi<ISchedule[]>("/api/schedules"),
    getApi<IAirport[]>("/api/airports"),
    getApi<ICompany[]>("/api/companies"),
    getApi<IStatus[]>("/api/statuses"),
  ])

  return (
    <Schedule
      initialSchedules={schedules ?? []}
      airports={airports ?? []}
      companies={companies ?? []}
      statuses={statuses ?? []}
    />
  )
}
