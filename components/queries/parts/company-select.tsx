import type { ICompany } from "@/models/company-model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ICompanySelectProps } from "@/types/props/queries"

export function CompanySelect(props: ICompanySelectProps) {
  const { value, onChange, companies, disabled } = props

  return (
    <Select
      value={value}
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
