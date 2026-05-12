import type { ISchedule } from "@/models/schedule-model"
import type { IAirport } from "@/models/airport-model"

type IProps = {
  flights: ISchedule[]
  airports: IAirport[]
  hasQueried: boolean
}

export function FlightList(props: IProps) {
  const { flights, airports, hasQueried } = props
  const airportMap = Object.fromEntries(
    airports.map((airport) => [airport.id, airport.name])
  )

  if (!hasQueried) {
    return null
  }

  if (flights.length === 0) {
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
            <th className="px-3 py-2 font-medium">Lėktuvas</th>
            <th className="px-3 py-2 font-medium">Išvykimas</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id} className="border-t">
              <td className="px-3 py-2">{flight.flightNumber}</td>
              <td className="px-3 py-2">
                {airportMap[flight.airportId] ?? flight.airportId}
              </td>
              <td className="px-3 py-2">
                {airportMap[flight.arrivalAirportId] ?? flight.arrivalAirportId}
              </td>
              <td className="px-3 py-2">{flight.aircraftType}</td>
              <td className="px-3 py-2">{new Date(flight.departureTime).toLocaleString("lt-LT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
