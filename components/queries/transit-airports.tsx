"use client"

import { useState } from "react"
import type { IAirport } from "@/models/airport-model"
import { TransitAirportsQuery } from "./parts/transit-airports-query"
import { getApi } from "@/utils/server-api"

type TransitAirport = {
  code: string
  name: string
}

type IProps = {
  airports: IAirport[]
}

export function TransitAirports(props: IProps) {
  const { airports } = props

  const [destinationAirportId, setDestinationAirportId] = useState("")
  const [transitAirports, setTransitAirports] = useState<TransitAirport[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!destinationAirportId) return
    setIsLoading(true)
    const data = await getApi<TransitAirport[]>(
      `/api/queries/transit-airports?destinationAirportId=${encodeURIComponent(
        destinationAirportId
      )}`
    )
    setTransitAirports(data ?? [])
    setIsLoading(false)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Tranzito oro uostai
        </h1>
      </div>

      <TransitAirportsQuery
        airports={airports}
        destinationAirportId={destinationAirportId}
        onDestinationChange={setDestinationAirportId}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        transitAirports={transitAirports}
      />
    </div>
  )
}
