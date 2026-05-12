"use client"

import { useState } from "react"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { FlightsByCompanyQuery } from "./parts/flights-by-company-query"
import { getApi } from "@/utils/server-api"

type IProps = {
  airports: IAirport[]
  companies: ICompany[]
}

export function FlightsByCompany(props: IProps) {
  const { airports, companies } = props

  const [companyId, setCompanyId] = useState("")
  const [flights, setFlights] = useState<ISchedule[]>([])
  const [hasQueried, setHasQueried] = useState(false)

  const handleSubmit = async () => {
    if (!companyId) return
    const data = await getApi<ISchedule[]>(
      `/api/flights-by-company?companyId=${encodeURIComponent(companyId)}`
    )
    setFlights(data ?? [])
    setHasQueried(true)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skrydžiai pagal kompaniją
        </h1>
      </div>

      <FlightsByCompanyQuery
        airports={airports}
        companies={companies}
        companyId={companyId}
        onCompanyChange={(id) => {
          setCompanyId(id)
          setHasQueried(false)
        }}
        onSubmit={handleSubmit}
        flights={flights}
        hasQueried={hasQueried}
      />
    </div>
  )
}
