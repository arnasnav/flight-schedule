import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"

export type IArrivalsProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export type IArrivalsListProps = {
  flights: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  onToggleArrival: (flight: ISchedule) => void
}

export type IArrivalsSearchProps = {
  value: string
  onChange: (val: string) => void
}
