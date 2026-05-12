import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { CompanySelect } from "./company-select"
import { FlightList } from "./flight-list"

type IProps = {
  airports: IAirport[]
  companies: ICompany[]
  companyId: string
  onCompanyChange: (value: string) => void
  onSubmit: () => void
  flights: ISchedule[]
  hasQueried: boolean
}

export function FlightsByCompanyQuery(props: IProps) {
  const {
    airports,
    companies,
    companyId,
    onCompanyChange,
    onSubmit,
    flights,
    hasQueried,
  } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tam tikros kompanijos skrydžių sąrašas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <CompanySelect
            value={companyId}
            onChange={onCompanyChange}
            companies={companies}
          />
          <Button onClick={onSubmit}>Vykdyti</Button>
        </div>
        <FlightList flights={flights} airports={airports} hasQueried={hasQueried} />
      </CardContent>
    </Card>
  )
}
