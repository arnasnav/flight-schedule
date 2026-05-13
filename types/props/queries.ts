import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { ITransitAirport } from "@/types/transit-airport"

export type IFlightsProps = {
  airports: IAirport[]
  companies: ICompany[]
}

export type IFlightsResultsTableProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  hasQueried: boolean
}

export type IAirportSelectProps = {
  value: string
  onChange: (value: string) => void
  airports: IAirport[]
  placeholder?: string
  disabled?: boolean
}

export type ICompanySelectProps = {
  value: string
  onChange: (value: string) => void
  companies: ICompany[]
  disabled?: boolean
}

export type ITransitAirportsProps = {
  airports: IAirport[]
}

export type ITransitAirportsQueryProps = {
  airports: IAirport[]
  destinationAirportId: string
  onDestinationChange: (value: string) => void
  transitAirports: ITransitAirport[]
  hasQueried: boolean
}
