"use client"

import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"

import type { AddScheduleFormValues } from "./schedule-form-schema"

type IProps = {
  control: Control<AddScheduleFormValues>
  airports: IAirport[]
  companies: ICompany[]
}

export function AddScheduleFormFieldsMain(props: IProps) {
  const { control, airports, companies } = props

  return (
    <>
      <div className="col-span-full pt-1">
        <p className="text-sm font-semibold">Pagrindinė informacija</p>
      </div>
      <Controller
        name="airportId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Išvykimo oro uostas</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite išvykimo oro uostą (pvz. Vilnius)" />
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

      <Controller
        name="arrivalAirportId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Atvykimo oro uostas</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite atvykimo oro uostą (pvz. Ryga)" />
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

      <Controller
        name="companyId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Kompanija</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pasirinkite kompaniją (pvz. Ryanair)" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id!}>
                    {c.name} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        name="flightNumber"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Reiso numeris</FieldLabel>
            <Input {...field} placeholder="pvz. FR2871" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="flightId"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Skrydžio ID</FieldLabel>
            <Input {...field} placeholder="pvz. 123" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <div className="col-span-full pt-2">
        <p className="text-sm font-semibold">Išvykimo laikai</p>
      </div>

      <Controller
        name="departureTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Išvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="scheduledDepartureTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Planuotas išvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="actualDepartureTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Faktinis išvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="col-span-full pt-2">
        <p className="text-sm font-semibold">Atvykimo laikai</p>
      </div>

      <Controller
        name="arrivalTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Atvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="scheduledArrivalTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Planuotas atvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Controller
        name="actualArrivalTime"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Faktinis atvykimas</FieldLabel>
            <Input {...field} type="datetime-local" />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </>
  )
}
