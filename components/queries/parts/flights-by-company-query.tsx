import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { CompanySelect } from "./company-select"
import { FlightList } from "./flight-list"

type IProps = {
  companies: ICompany[]
  companyId: string
  onCompanyChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  flights: ISchedule[]
}

export function FlightsByCompanyQuery(props: IProps) {
  const { companies, companyId, onCompanyChange, onSubmit, isLoading, flights } =
    props

  const isDisabled = !companyId || isLoading
  const buttonLabel = isLoading ? "Vykdoma..." : "Vykdyti"

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
          <Button onClick={onSubmit} disabled={isDisabled}>
            {buttonLabel}
          </Button>
        </div>
        <FlightList flights={flights} />
      </CardContent>
    </Card>
  )
}
