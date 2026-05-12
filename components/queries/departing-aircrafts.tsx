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
  const [hasQueried, setHasQueried] = useState(false)

  const handleSubmit = async () => {
    if (!airportId) return
    const data = await getApi<string[]>(
      `/api/departing-aircrafts?airportId=${encodeURIComponent(airportId)}`
    )
    setAircrafts(data ?? [])
    setHasQueried(true)
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Išskrendantys lėktuvai
        </h1>
      </div>

      <DepartingAircraftsQuery
        airports={airports}
        airportId={airportId}
        onAirportChange={(id) => {
          setAirportId(id)
          setHasQueried(false)
        }}
        onSubmit={handleSubmit}
        aircrafts={aircrafts}
        hasQueried={hasQueried}
      />
    </div>
  )
}
