import type { ISchedule } from "@/models/schedule-model"

type IProps = {
  flights: ISchedule[]
}

export function FlightList(props: IProps) {
  const { flights } = props

  if (flights.length === 0) {
    return <p className="text-sm text-muted-foreground">Rezultatų nėra.</p>
  }

  return (
    <div className="space-y-2">
      {flights.map((flight) => (
        <div key={flight.id} className="rounded-md border p-3 text-sm">
          <p className="font-medium">{flight.flightNumber}</p>
          <p className="text-muted-foreground">
            {flight.airportId} -{">"} {flight.arrivalAirportId}
          </p>
          <p className="text-muted-foreground">
            Lektuvas: {flight.aircraftType}, isvykimas: {flight.departureTime}
          </p>
        </div>
      ))}
    </div>
  )
}
