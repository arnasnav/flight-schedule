"use client"

import { useState } from "react"
import type { IAirport } from "@/models/airport-model"
import { DepartingAircraftsQuery } from "./parts/departing-aircrafts-query"
import { getApi } from "@/utils/server-api"

type IProps = {
  airports: IAirport[]
}

export function DepartingAircrafts(props: IProps) {
  const { airports } = props

  const [airportId, setAirportId] = useState("")
  const [aircrafts, setAircrafts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!airportId) return
    setIsLoading(true)
    const data = await getApi<string[]>(
      `/api/queries/departing-aircrafts?airportId=${encodeURIComponent(
        airportId
      )}`
    )
    setAircrafts(data ?? [])
    setIsLoading(false)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Isskrendantys lektuvai
        </h1>
      </div>

      <DepartingAircraftsQuery
        airports={airports}
        airportId={airportId}
        onAirportChange={setAirportId}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        aircrafts={aircrafts}
      />
    </div>
  )
}
