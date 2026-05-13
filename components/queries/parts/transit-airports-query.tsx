import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ITransitAirportsQueryProps } from "@/types/props/queries"

import { AirportSelect } from "./airport-select"

export function TransitAirportsQuery(props: ITransitAirportsQueryProps) {
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
                    <th className="px-3 py-2 font-medium">Kodas</th>
                    <th className="px-3 py-2 font-medium">Pavadinimas</th>
                  </tr>
                </thead>
                <tbody>
                  {transitAirports.map((row) => (
                    <tr key={row.code} className="border-t">
                      <td className="px-3 py-2">{row.code}</td>
                      <td className="px-3 py-2">{row.name}</td>
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
