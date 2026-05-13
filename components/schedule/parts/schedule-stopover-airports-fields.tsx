"use client"

import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { IScheduleStopoverAirportsFieldsProps } from "@/types/props/schedule"

export function ScheduleStopoverAirportsFields(
  props: IScheduleStopoverAirportsFieldsProps,
) {
  const { control, stopovers, airports } = props

  return (
    <div className="col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel>Tarpiniai uostai</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => stopovers.append({ airportId: "" })}
        >
          Pridėti
        </Button>
      </div>

      {stopovers.fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Tarpinių uostų nepridėta.
        </p>
      )}

      {stopovers.fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_auto] gap-2 items-end"
        >
          <Controller
            name={`stopoverAirports.${index}.airportId`}
            control={control}
            render={({ field: inputField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Select
                  value={inputField.value}
                  onValueChange={inputField.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite tarpinį oro uostą" />
                  </SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.id} value={a.id!}>
                        {a.name} ({a.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => stopovers.remove(index)}
          >
            Ištrinti
          </Button>
        </div>
      ))}
    </div>
  )
}
