"use client"

import { useState, useMemo } from "react"
import { ISchedule } from "@/models/schedule-model"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { ArrivalsSearch } from "./parts/arrivals-search"
import { ArrivalsList } from "./parts/arrivals-list"

type IProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export function ArrivalsPage(props: IProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSchedules = useMemo(() => {
    return props.schedules.filter((s) =>
      s.flightNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [props.schedules, searchQuery])

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Atvykimai
        </h1>
        <p className="text-muted-foreground mt-1">Skrydžių atvykimo paieška.</p>
      </div>

      <ArrivalsSearch value={searchQuery} onChange={setSearchQuery} />

      <ArrivalsList
        flights={filteredSchedules}
        airports={props.airports}
        companies={props.companies}
      />
    </div>
  )
}
