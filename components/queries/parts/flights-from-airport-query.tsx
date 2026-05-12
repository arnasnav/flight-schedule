import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IAirport } from "@/models/airport-model"
import type { ISchedule } from "@/models/schedule-model"
import { AirportSelect } from "./airport-select"
import { FlightList } from "./flight-list"

type IProps = {
  airports: IAirport[]
  airportId: string
  onAirportChange: (value: string) => void
  onSubmit: () => void
  flights: ISchedule[]
  hasQueried: boolean
}

export function FlightsFromAirportQuery(props: IProps) {
  const { airports, airportId, onAirportChange, onSubmit, flights, hasQueried } =
    props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skrydžių iš tam tikro oro uosto sąrašas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <AirportSelect
            value={airportId}
            onChange={onAirportChange}
            airports={airports}
          />
          <Button onClick={onSubmit}>Vykdyti</Button>
        </div>
        <FlightList flights={flights} airports={airports} hasQueried={hasQueried} />
      </CardContent>
    </Card>
  )
}
