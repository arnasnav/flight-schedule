import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IAirport } from "@/models/airport-model"
import { AirportSelect } from "./airport-select"

type IProps = {
  airports: IAirport[]
  airportId: string
  onAirportChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  aircrafts: string[]
}

export function DepartingAircraftsQuery(props: IProps) {
  const { airports, airportId, onAirportChange, onSubmit, isLoading, aircrafts } =
    props

  const isDisabled = !airportId || isLoading
  const buttonLabel = isLoading ? "Vykdoma..." : "Vykdyti"
  const resultText = aircrafts.length > 0 ? aircrafts.join(", ") : "Rezultatų nėra."

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kokie lektuvai isskrenda is tam tikro oro uosto?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <AirportSelect
            value={airportId}
            onChange={onAirportChange}
            airports={airports}
          />
          <Button onClick={onSubmit} disabled={isDisabled}>
            {buttonLabel}
          </Button>
        </div>
        <p className="text-sm">{resultText}</p>
      </CardContent>
    </Card>
  )
}
