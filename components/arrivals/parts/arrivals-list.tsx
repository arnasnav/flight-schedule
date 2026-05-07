"use client"

import { ISchedule } from "@/models/schedule-model"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type IProps = {
  flights: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export function ArrivalsList(props: IProps) {
  const getAirportName = (id: string) =>
    props.airports.find((a) => a.id === id)?.name || "Nėra"

  const getCompanyName = (id: string) =>
    props.companies.find((c) => c.id === id)?.name || "Nėra"

  if (props.flights.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
        Skrydžių pagal šį numerį nerasta.
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {props.flights.map((flight) => (
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
                <p className="font-medium">
                  {getCompanyName(flight.companyId)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Iš oro uosto</p>
                <p className="font-medium">
                  {getAirportName(flight.airportId)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border">
              <Checkbox
                id={`arrived-${flight.id}`}
                checked={flight.hasArrived}
                disabled
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
      ))}
    </div>
  )
}
