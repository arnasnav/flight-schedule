import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"

type IProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  hasQueried: boolean
}

export function FlightsResultsTable(props: IProps) {
  const { schedules, airports, companies, hasQueried } = props

  const airportMap = Object.fromEntries(airports.map((a) => [a.id, a.name]))
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]))

  if (!hasQueried) {
    return (
      <p className="text-sm text-muted-foreground">
        Pasirinkite užklausos tipą ir tada kompaniją arba oro uostą pagal tipą.
      </p>
    )
  }

  if (schedules.length === 0) {
    return <p className="text-sm text-muted-foreground">Rezultatų nėra.</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 text-left">
            <th className="px-3 py-2 font-medium">Skrydis</th>
            <th className="px-3 py-2 font-medium">Iš kur</th>
            <th className="px-3 py-2 font-medium">Į kur</th>
            <th className="px-3 py-2 font-medium">Kompanija</th>
            <th className="px-3 py-2 font-medium">Lėktuvas</th>
            <th className="px-3 py-2 font-medium">Išvykimo laikas</th>
            <th className="px-3 py-2 font-medium">Atvykimo laikas</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((flight, idx) => (
            <tr
              key={flight.id ?? `${flight.flightNumber}-${idx}`}
              className="border-t"
            >
              <td className="px-3 py-2">{flight.flightNumber}</td>
              <td className="px-3 py-2">
                {airportMap[flight.airportId] ?? flight.airportId}
              </td>
              <td className="px-3 py-2">
                {airportMap[flight.arrivalAirportId] ?? flight.arrivalAirportId}
              </td>
              <td className="px-3 py-2">
                {companyMap[flight.companyId] ?? flight.companyId}
              </td>
              <td className="px-3 py-2">{flight.aircraftType}</td>
              <td className="px-3 py-2">
                {new Date(flight.departureTime).toLocaleString("lt-LT")}
              </td>
              <td className="px-3 py-2">
                {new Date(flight.arrivalTime).toLocaleString("lt-LT")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
