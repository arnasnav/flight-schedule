"use client"

import { ISchedule } from "@/models/schedule-model"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { Button } from "@/components/ui/button"

type IProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  onEdit: (s: ISchedule) => void
  onDelete: (id: string) => void
}

export function ScheduleList(props: IProps) {
  const getCompanyName = (id: string) =>
    props.companies.find((c) => c.id === id)?.name || "Nenurodyta"

  const getAirportName = (id: string) =>
    props.airports.find((a) => a.id === id)?.name || "Nenurodyta"

  if (props.schedules.length === 0) {
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
        {props.schedules.map((s) => (
          <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-900">
              {s.flightNumber}
            </td>

            <td className="px-6 py-4">{getCompanyName(s.companyId)}</td>

            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-slate-600">
                  {getAirportName(s.airportId)}
                </span>

                <span className="text-xs text-slate-400">&rarr;</span>

                <span className="text-slate-600">
                  {getAirportName(s.arrivalAirportId)}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => props.onEdit(s)}
              >
                Keisti
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => props.onDelete(s.id!)}
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
