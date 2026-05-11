import { Schedule } from "@/components/schedule/schedule"
import { getApi } from "@/utils/server-api"
import type { IAirport } from "@/models/airport-model"
import type { IAircraft } from "@/models/aircraft-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { IStatus } from "@/models/status-model"
import type { ITerminal } from "@/models/terminal-model"

export default async function Page() {
  const [schedules, airports, companies, statuses, terminals, aircraft] =
    await Promise.all([
      getApi<ISchedule[]>("/api/schedules"),
      getApi<IAirport[]>("/api/airports"),
      getApi<ICompany[]>("/api/companies"),
      getApi<IStatus[]>("/api/statuses"),
      getApi<ITerminal[]>("/api/terminals"),
      getApi<IAircraft[]>("/api/aircrafts"),
    ])

  return (
    <Schedule
      initialSchedules={schedules ?? []}
      airports={airports ?? []}
      companies={companies ?? []}
      statuses={statuses ?? []}
      terminals={terminals ?? []}
      aircrafts={aircraft ?? []}
    />
  )
}
