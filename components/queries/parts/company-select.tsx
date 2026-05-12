import type { ICompany } from "@/models/company-model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type IProps = {
  value: string
  onChange: (value: string) => void
  companies: ICompany[]
}

export function CompanySelect(props: IProps) {
  const { value, onChange, companies } = props

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Pasirinkite kompaniją" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id!}>
            {company.name} ({company.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
