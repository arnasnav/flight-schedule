"use client"

import { Button } from "@/components/ui/button"
import type { IScheduleListProps } from "@/types/props/schedule"
import { findAirportById, findCompanyById } from "@/utils/entity-lookup"

export function ScheduleList(props: IScheduleListProps) {
  const { schedules, airports, companies, onEdit, onDelete } = props

  if (schedules.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground">
        Skrydžių nerasta
      </div>
    )
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("lt-LT")
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
        {schedules.map((s) => {
          const company = findCompanyById(companies, s.companyId)
          const departureAirport = findAirportById(airports, s.airportId)
          const arrivalAirport = findAirportById(airports, s.arrivalAirportId)

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
                <div>Išvykimas: {formatDate(s.departureTime)}</div>
                <div>
                  Plan. išv.:{" "}
                  {formatDate(s.scheduledDepartureTime) ||
                    formatDate(s.departureTime)}
                </div>
                <div>
                  Fakt. išv.:{" "}
                  {formatDate(s.actualDepartureTime) ||
                    formatDate(s.departureTime)}
                </div>
                <div>Atvykimas: {formatDate(s.arrivalTime)}</div>
                <div>
                  Plan. atv.:{" "}
                  {formatDate(s.scheduledArrivalTime) ||
                    formatDate(s.arrivalTime)}
                </div>
                <div>
                  Fakt. atv.:{" "}
                  {formatDate(s.actualArrivalTime) || formatDate(s.arrivalTime)}
                </div>
              </td>

              <td className="px-6 py-4 text-xs space-y-1">
                <div>Terminalas: {s.terminal}</div>
                <div>Vartai: {s.gate}</div>
                <div>Lėktuvas: {s.aircraftType}</div>
                <div>
                  Vietos: {s.availableSeatCount}/{s.seatCount}
                </div>
                <div>Kaina: {s.flightPrice} &euro;</div>
                <div>Bagažas: {s.baggageLimit} kg</div>
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
          )
        })}
      </tbody>
    </table>
  )
}
