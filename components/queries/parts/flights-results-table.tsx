import type { IFlightsResultsTableProps } from "@/types/props/queries"
import { getAirportNameOrId, getCompanyNameOrId } from "@/utils/entity-lookup"

function formatDate(date: string) {
  return new Date(date).toLocaleString("lt-LT")
}

export function FlightsResultsTable(props: IFlightsResultsTableProps) {
  const { schedules, airports, companies, hasQueried } = props

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
          {schedules.map((flight, idx) => {
            const departureLabel = getAirportNameOrId(
              airports,
              flight.airportId
            )
            const arrivalLabel = getAirportNameOrId(
              airports,
              flight.arrivalAirportId
            )
            const companyLabel = getCompanyNameOrId(companies, flight.companyId)

            return (
              <tr
                key={flight.id ?? `${flight.flightNumber}-${idx}`}
                className="border-t"
              >
                <td className="px-3 py-2">{flight.flightNumber}</td>
                <td className="px-3 py-2">{departureLabel}</td>
                <td className="px-3 py-2">{arrivalLabel}</td>
                <td className="px-3 py-2">{companyLabel}</td>
                <td className="px-3 py-2">{flight.aircraftType}</td>
                <td className="px-3 py-2">
                  {formatDate(flight.departureTime)}
                </td>
                <td className="px-3 py-2">
                  {formatDate(flight.arrivalTime)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
