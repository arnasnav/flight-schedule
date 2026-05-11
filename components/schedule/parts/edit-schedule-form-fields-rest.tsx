"use client"

import { Controller } from "react-hook-form"
import type { Control, UseFieldArrayReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IStatus } from "@/models/status-model"

import type { EditScheduleFormValues } from "./schedule-form-schema"

type IProps = {
  control: Control<EditScheduleFormValues>
  statuses: IStatus[]
  stopovers: UseFieldArrayReturn<EditScheduleFormValues, "stopoverAirports">
}

export function EditScheduleFormFieldsRest({
  control,
  statuses,
  stopovers,
}: IProps) {
  return (
    <>
      <div className="col-span-full pt-2">
        <p className="text-sm font-semibold">
          Skrydžio būsena ir techninė informacija
        </p>
      </div>
      <Controller
        name="flightStatus"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Skrydžio būsena</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite būseną" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.name}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="terminal"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Terminalas</FieldLabel>
            <Input {...field} placeholder="pvz. T1" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="gate"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Vartai</FieldLabel>
            <Input {...field} placeholder="pvz. A12" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="aircraftType"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Lėktuvo tipas</FieldLabel>
            <Input {...field} placeholder="pvz. Boeing 737-800" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="seatCount"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Vietų skaičius</FieldLabel>
            <Input {...field} type="number" placeholder="pvz. 189" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="availableSeatCount"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Laisvų vietų skaičius</FieldLabel>
            <Input {...field} type="number" placeholder="pvz. 42" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="flightPrice"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Skrydžio kaina</FieldLabel>
            <Input
              {...field}
              type="number"
              step="0.01"
              placeholder="pvz. 129.99"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="baggageLimit"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Bagažo limitas</FieldLabel>
            <Input {...field} placeholder="pvz. 20 kg + 8 kg rankinis" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <div className="col-span-2 space-y-2">
        <div className="flex items-center justify-between">
          <FieldLabel>Tarpiniai uostai</FieldLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => stopovers.append({ code: "", name: "" })}
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
          <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Controller
              name={`stopoverAirports.${index}.code`}
              control={control}
              render={({ field: inputField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...inputField} placeholder="Kodas (pvz. RIX)" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name={`stopoverAirports.${index}.name`}
              control={control}
              render={({ field: inputField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input {...inputField} placeholder="Pavadinimas" />
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
    </>
  )
}
