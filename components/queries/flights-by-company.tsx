"use client"

import { useState } from "react"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { FlightsByCompanyQuery } from "./parts/flights-by-company-query"
import { getApi } from "@/utils/server-api"

type IProps = {
  companies: ICompany[]
}

export function FlightsByCompany(props: IProps) {
  const { companies } = props

  const [companyId, setCompanyId] = useState("")
  const [flights, setFlights] = useState<ISchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!companyId) return
    setIsLoading(true)
    const data = await getApi<ISchedule[]>(
      `/api/queries/flights-by-company?companyId=${encodeURIComponent(
        companyId
      )}`
    )
    setFlights(data ?? [])
    setIsLoading(false)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skrydziai pagal kompanija
        </h1>
      </div>

      <FlightsByCompanyQuery
        companies={companies}
        companyId={companyId}
        onCompanyChange={setCompanyId}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        flights={flights}
      />
    </div>
  )
}
