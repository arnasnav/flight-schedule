"use client"

import {
  Controller,
  useWatch,
} from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { IScheduleFormTechnicalFieldsProps } from "@/types/props/schedule"
import { findAircraftByName, findTerminalByName } from "@/utils/entity-lookup"

export function ScheduleFormTechnicalFields(
  props: IScheduleFormTechnicalFieldsProps,
) {
  const {
    control,
    setValue,
    getValues,
    statuses,
    terminals,
    aircrafts,
  } = props

  const terminal = useWatch({ control, name: "terminal" })
  const selectedTerminal = findTerminalByName(terminals, terminal)
  const gates = selectedTerminal?.gates ?? []

  return (
    <>
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
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v)
                setValue("gate", "", { shouldValidate: true })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite terminalą" />
              </SelectTrigger>
              <SelectContent>
                {terminals.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={gates.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    gates.length === 0
                      ? "Pirmiausia pasirinkite terminalą"
                      : "Pasirinkite vartus"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {gates.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select
              value={field.value}
              onValueChange={(name) => {
                field.onChange(name)
                const ac = findAircraftByName(aircrafts, name)
                if (ac) {
                  setValue("seatCount", String(ac.seats), {
                    shouldValidate: true,
                  })
                  const avail = Number(getValues("availableSeatCount"))
                  if (!Number.isNaN(avail) && avail > ac.seats) {
                    setValue("availableSeatCount", String(ac.seats), {
                      shouldValidate: true,
                    })
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite lėktuvą" />
              </SelectTrigger>
              <SelectContent>
                {aircrafts.map((a) => (
                  <SelectItem key={a.id} value={a.name}>
                    {a.name} ({a.seats} vietų)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Input {...field} placeholder="pvz. 20" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </>
  )
}
