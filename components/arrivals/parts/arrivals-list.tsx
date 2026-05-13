"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { IArrivalsListProps } from "@/types/props/arrivals"
import { getAirportName, getCompanyName } from "@/utils/entity-lookup"

export function ArrivalsList(props: IArrivalsListProps) {
  const { flights, airports, companies, onToggleArrival } = props

  if (flights.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
        Skrydžių pagal šį numerį nerasta.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {flights.map((flight) => {
        const companyName = getCompanyName(companies, flight.companyId)
        const airportName = getAirportName(airports, flight.airportId)

        return (
          <Card key={flight.id} className="hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex gap-8 items-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Reisas
                  </p>
                  <p className="text-xl font-bold">{flight.flightNumber}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Kompanija</p>
                  <p className="font-medium">{companyName}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Iš oro uosto</p>
                  <p className="font-medium">{airportName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border">
                <Checkbox
                  id={`arrived-${flight.id}`}
                  checked={flight.hasArrived}
                  onCheckedChange={() => onToggleArrival(flight)}
                />
                <Label
                  htmlFor={`arrived-${flight.id}`}
                  className="cursor-pointer font-medium"
                >
                  Atvyko
                </Label>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
