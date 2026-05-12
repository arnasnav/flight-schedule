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
  disabled?: boolean
}

export function CompanySelect(props: IProps) {
  const { value, onChange, companies, disabled } = props

  return (
    <Select
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
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
