import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IAirport } from "@/models/airport-model"
import { AirportSelect } from "./airport-select"

type TransitAirport = {
  code: string
  name: string
}

type IProps = {
  airports: IAirport[]
  destinationAirportId: string
  onDestinationChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  transitAirports: TransitAirport[]
}

export function TransitAirportsQuery(props: IProps) {
  const {
    airports,
    destinationAirportId,
    onDestinationChange,
    onSubmit,
    isLoading,
    transitAirports,
  } = props

  const isDisabled = !destinationAirportId || isLoading
  const buttonLabel = isLoading ? "Vykdoma..." : "Vykdyti"
  const resultText =
    transitAirports.length > 0
      ? transitAirports.map((airport) => `${airport.name} (${airport.code})`).join(", ")
      : "Rezultatų nėra."

  return (
    <Card>
      <CardHeader>
        <CardTitle>Per kokį oro uostą galima įvykdyti tranzitą?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <AirportSelect
            value={destinationAirportId}
            onChange={onDestinationChange}
            airports={airports}
            placeholder="Pasirinkite tikslinę vietą"
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
