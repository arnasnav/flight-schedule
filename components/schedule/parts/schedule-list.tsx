"use client"

import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import { Button } from "@/components/ui/button"

type IProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  onEdit: (s: ISchedule) => void
  onDelete: (id: string) => void
}

export function ScheduleList(props: IProps) {
  const companyMap = Object.fromEntries(props.companies.map((c) => [c.id, c]))

  const airportMap = Object.fromEntries(props.airports.map((a) => [a.id, a]))

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
          <th className="px-6 py-4">Skrydžio info</th>
          <th className="px-6 py-4">Maršrutas ir tarpiniai</th>
          <th className="px-6 py-4">Laikai</th>
          <th className="px-6 py-4">Papildoma info</th>
          <th className="px-6 py-4">Statusas</th>
          <th className="px-6 py-4 text-right">Veiksmai</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {props.schedules.map((s) => {
          const company = companyMap[s.companyId]
          const departureAirport = airportMap[s.airportId]
          const arrivalAirport = airportMap[s.arrivalAirportId]

          return (
            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900 text-xs space-y-1">
                <div>Skrydžio ID: {s.flightId}</div>
                <div>Reiso nr.: {s.flightNumber}</div>

                <div>
                  Aviakompanija: {company?.code} - {company?.name}
                </div>
              </td>

              <td className="px-6 py-4 text-xs space-y-1">
                <div className="flex flex-col">
                  <span className="text-slate-600">
                    {departureAirport?.code} - {departureAirport?.name}
                  </span>

                  <span className="text-xs text-slate-400">&rarr;</span>

                  <span className="text-slate-600">
                    {arrivalAirport?.code} - {arrivalAirport?.name}
                  </span>

                  {!!s.stopoverAirports?.length && (
                    <span className="text-xs text-slate-500 mt-1">
                      Tarpiniai:{" "}
                      {s.stopoverAirports
                        .map(
                          (stopover) => `${stopover.code} - ${stopover.name}`
                        )
                        .join(", ")}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-xs space-y-1">
                <div>
                  Išvykimas: {new Date(s.departureTime).toLocaleString("lt-LT")}
                </div>
                <div>
                  Plan. išv.:{" "}
                  {new Date(
                    s.scheduledDepartureTime || s.departureTime
                  ).toLocaleString("lt-LT")}
                </div>
                <div>
                  Fakt. išv.:{" "}
                  {new Date(
                    s.actualDepartureTime || s.departureTime
                  ).toLocaleString("lt-LT")}
                </div>
                <div>
                  Atvykimas: {new Date(s.arrivalTime).toLocaleString("lt-LT")}
                </div>
                <div>
                  Plan. atv.:{" "}
                  {new Date(
                    s.scheduledArrivalTime || s.arrivalTime
                  ).toLocaleString("lt-LT")}
                </div>
                <div>
                  Fakt. atv.:{" "}
                  {new Date(
                    s.actualArrivalTime || s.arrivalTime
                  ).toLocaleString("lt-LT")}
                </div>
              </td>

              <td className="px-6 py-4 text-xs space-y-1">
                <div>Terminalas: {s.terminal}</div>
                <div>Vartai: {s.gate}</div>
                <div>Lėktuvas: {s.aircraftType}</div>
                <div>
                  Vietos: {s.availableSeatCount}/{s.seatCount}
                </div>
                <div>Kaina: {s.flightPrice}</div>
                <div>Bagažas: {s.baggageLimit}</div>
              </td>

              <td className="px-6 py-4 text-xs space-y-2">
                <div>
                  {s.flightStatus ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
                      {s.flightStatus.toUpperCase()}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                      SKRYDŽIO BŪSENA NENURODYTA
                    </span>
                  )}
                </div>

                <div>
                  {s.hasArrived ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">
                      LĖKTUVAS ATVYKO
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
                      LĖKTUVAS DAR NEATVYKO
                    </span>
                  )}
                </div>
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
          )
        })}
      </tbody>
    </table>
  )
}
