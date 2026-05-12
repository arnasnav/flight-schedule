import type { IAirport } from "@/models/airport-model"
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
  airports: IAirport[]
  placeholder?: string
}

export function AirportSelect(props: IProps) {
  const {
    value,
    onChange,
    airports,
    placeholder = "Pasirinkite oro uostą",
  } = props

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {airports.map((airport) => (
          <SelectItem key={airport.id} value={airport.id!}>
            {airport.name} ({airport.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
