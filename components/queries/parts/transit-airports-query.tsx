import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  transitAirports: TransitAirport[]
  hasQueried: boolean
}

export function TransitAirportsQuery(props: IProps) {
  const {
    airports,
    destinationAirportId,
    onDestinationChange,
    transitAirports,
    hasQueried,
  } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Per kokį oro uostą galima įvykdyti tranzitą?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AirportSelect
          value={destinationAirportId}
          onChange={onDestinationChange}
          airports={airports}
          placeholder="Pasirinkite tikslinę vietą"
        />
        {hasQueried &&
          (transitAirports.length === 0 ? (
            <p className="text-sm text-muted-foreground">Rezultatų nėra.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-3 py-2 font-medium">Oro uostas</th>
                    <th className="px-3 py-2 font-medium">Kodas</th>
                  </tr>
                </thead>
                <tbody>
                  {transitAirports.map((airport) => (
                    <tr key={airport.code} className="border-t">
                      <td className="px-3 py-2">{airport.name}</td>
                      <td className="px-3 py-2">{airport.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
