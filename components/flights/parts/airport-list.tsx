"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { IAirportListProps } from "@/types/props/flights"

export function AirportList(props: IAirportListProps) {
  const { airports, onDelete, onEdit } = props
  if (airports.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        Kraunama arba nėra įrašų
      </div>
    )
  }

  return (
    <ul className="w-full">
      {airports.map((airport, index) => (
        <li key={airport.id}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">
                {airport.name} ({airport.code})
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {airport.id}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(airport)}
              >
                Keisti
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(airport.id!)}
              >
                Ištrinti
              </Button>
            </div>
          </div>

          {index !== airports.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}
