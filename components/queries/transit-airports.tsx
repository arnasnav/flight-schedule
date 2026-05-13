"use client"

import { useState } from "react"
import { TransitAirportsQuery } from "./parts/transit-airports-query"
import { getApi } from "@/utils/server-api"
import type { ITransitAirport } from "@/types/transit-airport"
import type { ITransitAirportsProps } from "@/types/props/queries"

export function TransitAirports(props: ITransitAirportsProps) {
  const { airports } = props

  const [destinationAirportId, setDestinationAirportId] = useState("")
  const [transitAirports, setTransitAirports] = useState<ITransitAirport[]>([])
  const [hasQueried, setHasQueried] = useState(false)

  const handleDestinationChange = async (id: string) => {
    setDestinationAirportId(id)
    if (!id) {
      setTransitAirports([])
      setHasQueried(false)
      return
    }
    const data = await getApi<ITransitAirport[]>(
      `/api/transit-airports?destinationAirportId=${id}`,
    )
    setTransitAirports(data ?? [])
    setHasQueried(true)
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
        onDestinationChange={(id) => {
          void handleDestinationChange(id)
        }}
        transitAirports={transitAirports}
        hasQueried={hasQueried}
      />
    </div>
  )
}
