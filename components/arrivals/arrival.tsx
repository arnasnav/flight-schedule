"use client"

import { useState } from "react"
import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import { ArrivalsSearch } from "./parts/arrivals-search"
import { ArrivalsList } from "./parts/arrivals-list"
import { putApi, getApi } from "@/utils/server-api"
import { toast } from "sonner"

type IProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export function Arrivals(props: IProps) {
  const {
    schedules: initialSchedules,
    airports,
    companies,
  } = props

  const [schedules, setSchedules] = useState<ISchedule[]>(initialSchedules)
  const [searchQuery, setSearchQuery] = useState("")

  const refreshSchedules = async () => {
    const data = await getApi<ISchedule[]>("/api/schedules")
    setSchedules(data ?? [])
  }

  const handleToggleArrival = async (flight: ISchedule) => {
    await putApi(`/api/schedules`, {
      id: flight.id,
      ...flight,
      hasArrived: !flight.hasArrived,
    })

    toast.success(
      flight.hasArrived
        ? "Skrydžio atvykimas sėkmingai atšauktas"
        : "Skrydžio atvykimas sėkmingai pažymėtas"
    )

    await refreshSchedules()
  }

  const filteredSchedules = schedules.filter((s) =>
    s.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Atvykimų valdymas
        </h1>
        <p className="text-muted-foreground mt-1">
          Pažymėkite atvykusius skrydžius.
        </p>
      </div>

      <ArrivalsSearch value={searchQuery} onChange={setSearchQuery} />

      <ArrivalsList
        flights={filteredSchedules}
        airports={airports}
        companies={companies}
        onToggleArrival={handleToggleArrival}
      />
    </div>
  )
}
