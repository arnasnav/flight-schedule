"use client"

import { useState } from "react"
import type { IAirport } from "@/models/airport-model"
import type { ISchedule } from "@/models/schedule-model"
import { FlightsFromAirportQuery } from "./parts/flights-from-airport-query"
import { getApi } from "@/utils/server-api"

type IProps = {
  airports: IAirport[]
}

export function FlightsFromAirport(props: IProps) {
  const { airports } = props

  const [airportId, setAirportId] = useState("")
  const [flights, setFlights] = useState<ISchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!airportId) return
    setIsLoading(true)
    const data = await getApi<ISchedule[]>(
      `/api/queries/flights-from-airport?airportId=${encodeURIComponent(
        airportId
      )}`
    )
    setFlights(data ?? [])
    setIsLoading(false)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skrydziai is oro uosto
        </h1>
      </div>

      <FlightsFromAirportQuery
        airports={airports}
        airportId={airportId}
        onAirportChange={setAirportId}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        flights={flights}
      />
    </div>
  )
}
