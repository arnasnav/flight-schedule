import type { IAirport } from "@/models/airport-model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IAirportSelectProps } from "@/types/props/queries"

export function AirportSelect(props: IAirportSelectProps) {
  const {
    value,
    onChange,
    airports,
    placeholder = "Pasirinkite oro uostą",
    disabled,
  } = props

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
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
