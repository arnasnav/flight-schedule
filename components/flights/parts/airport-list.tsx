"use client"

import { IAirport } from "@/models/airport-model"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type IProps = {
  airports: IAirport[]
  onDelete: (id: string) => void
  onEdit: (airport: IAirport) => void
}

export function AirportList(props: IProps) {
  if (props.airports.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        Kraunama arba nėra įrašų
      </div>
    )
  }

  return (
    <ul className="w-full">
      {props.airports.map((airport, index) => (
        <li key={airport.id}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{airport.name}</span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {airport.id}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => props.onEdit(airport)}
              >
                Keisti
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => props.onDelete(airport.id!)}
              >
                Ištrinti
              </Button>
            </div>
          </div>

          {index !== props.airports.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}
