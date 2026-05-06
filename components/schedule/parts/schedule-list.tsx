"use client"

import { ISchedule } from "@/models/schedule-model"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { Button } from "@/components/ui/button"

type Props = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  onEdit: (s: ISchedule) => void
  onDelete: (id: string) => void
}

export function ScheduleList({
  schedules,
  airports,
  companies,
  onEdit,
  onDelete,
}: Props) {
  if (schedules.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        Skrydžių nerasta
      </div>
    )
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
        <tr>
          <th className="px-6 py-4">Reisas</th>
          <th className="px-6 py-4">Kompanija</th>
          <th className="px-6 py-4">Iš kur / Į kur</th>
          <th className="px-6 py-4">Laikas</th>
          <th className="px-6 py-4">Statusas</th>
          <th className="px-6 py-4 text-right">Veiksmai</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {schedules.map((s) => (
          <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-900">
              {s.flightNumber}
            </td>

            <td className="px-6 py-4">
              {companies.find((c) => c.id === s.companyId)?.code ||
                "Nenurodyta"}
            </td>

            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-slate-600">
                  {airports.find((a) => a.id === s.airportId)?.name}
                </span>

                <span className="text-xs text-slate-400">&rarr;</span>

                <span className="text-slate-600">
                  {airports.find((a) => a.id === s.arrivalAirportId)?.name}
                </span>
              </div>
            </td>

            <td className="px-6 py-4 text-xs space-y-1">
              <div>
                Išvykimas: {new Date(s.departureTime).toLocaleString("lt-LT")}
              </div>
              <div>
                Atvykimas: {new Date(s.arrivalTime).toLocaleString("lt-LT")}
              </div>
            </td>

            <td className="px-6 py-4">
              {s.hasArrived ? (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                  ATVYKO
                </span>
              ) : (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                  SKRENDA
                </span>
              )}
            </td>

            <td className="px-6 py-4 text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(s)}>
                Keisti
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(s.id!)}
              >
                Ištrinti
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
