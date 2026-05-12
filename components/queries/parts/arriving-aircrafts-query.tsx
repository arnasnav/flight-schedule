import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IAirport } from "@/models/airport-model"
import { AirportSelect } from "./airport-select"

type IProps = {
  airports: IAirport[]
  airportId: string
  onAirportChange: (value: string) => void
  onSubmit: () => void
  aircrafts: string[]
  hasQueried: boolean
}

export function ArrivingAircraftsQuery(props: IProps) {
  const { airports, airportId, onAirportChange, onSubmit, aircrafts, hasQueried } =
    props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kokie lėktuvai atskrenda į tam tikrą oro uostą?</CardTitle>
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
        {hasQueried &&
          (aircrafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Rezultatų nėra.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-3 py-2 font-medium">Lėktuvo tipas</th>
                  </tr>
                </thead>
                <tbody>
                  {aircrafts.map((aircraft) => (
                    <tr key={aircraft} className="border-t">
                      <td className="px-3 py-2">{aircraft}</td>
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
