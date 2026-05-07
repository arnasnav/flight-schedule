"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { differenceInMinutes, isBefore, parseISO } from "date-fns"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { ISchedule } from "@/models/schedule-model"
import { toast } from "sonner"

const toDateTimeLocal = (dateStr: string | Date) => {
  const d = new Date(dateStr)
  const dt = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return dt.toISOString().slice(0, 16)
}

type IProps = {
  schedule: ISchedule
  onClose: () => void
  onConfirm: (data: any) => void
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
}

export function EditScheduleDialog(props: IProps) {
  const formSchema = z
    .object({
      airportId: z.string().min(1, "Pasirinkite išvykimo oro uostą"),
      companyId: z.string().min(1, "Pasirinkite kompaniją"),
      flightNumber: z
        .string()
        .trim()
        .min(1, "Įveskite reiso numerį")
        .refine(
          (val) =>
            !props.existingSchedules.some(
              (s) =>
                s.id !== props.schedule.id &&
                s.flightNumber.toLowerCase() === val.toLowerCase()
            ),
          { message: "Šis reiso numeris jau egzistuoja" }
        ),
      departureTime: z.string().min(1, "Pasirinkite išvykimo laiką"),
      arrivalAirportId: z.string().min(1, "Pasirinkite atvykimo oro uostą"),
      arrivalTime: z.string().min(1, "Pasirinkite atvykimo laiką"),
      hasArrived: z.boolean(),
    })
    .refine((data) => data.airportId !== data.arrivalAirportId, {
      message: "Išvykimo ir atvykimo oro uostai negali sutapti",
      path: ["arrivalAirportId"],
    })
    .refine(
      (data) => {
        const dep = parseISO(data.departureTime)
        const arr = parseISO(data.arrivalTime)
        return isBefore(dep, arr)
      },
      {
        message: "Išvykimo laikas turi būti ankstesnis už atvykimo",
        path: ["arrivalTime"],
      }
    )
    .refine(
      (data) => {
        const newDep = parseISO(data.departureTime)

        const otherFlights = props.existingSchedules.filter(
          (s) => s.id !== props.schedule.id
        )

        const sameAirportFlights = otherFlights.filter(
          (s) => s.airportId === data.airportId
        )

        const sameTimeFlights = sameAirportFlights.filter(
          (s) => parseISO(s.departureTime).getTime() === newDep.getTime()
        )

        if (sameTimeFlights.length >= 2) return false

        const tooClose = sameAirportFlights.some((s) => {
          const existingDep = parseISO(s.departureTime)
          const diff = Math.abs(differenceInMinutes(existingDep, newDep))
          return diff > 0 && diff < 20
        })

        return !tooClose
      },
      {
        message:
          "Viršytas limitas (max 2 skrydžiai vienu metu) arba tarpas mažesnis nei 20 min.",
        path: ["departureTime"],
      }
    )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  React.useEffect(() => {
    form.reset(props.schedule)
  }, [props.schedule, form])

  function onSubmit(data: z.infer<typeof formSchema>) {
    props.onConfirm(data)
    toast.success("Skrydžio informacija sėkmingai atnaujinta")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Redaguoti skrydžio informaciją</DialogTitle>
          <DialogDescription>
            Įveskite naują skrydžio informaciją.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-schedule-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="airportId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Išvykimo oro uostas</FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite" />
                    </SelectTrigger>

                    <SelectContent>
                      {props.airports.map((a) => (
                        <SelectItem key={a.id} value={a.id!}>
                          {a.name}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Atvykimo oro uostas</FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite" />
                    </SelectTrigger>

                    <SelectContent>
                      {props.airports.map((a) => (
                        <SelectItem key={a.id} value={a.id!}>
                          {a.name}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Kompanija</FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite" />
                    </SelectTrigger>

                    <SelectContent>
                      {props.companies.map((c) => (
                        <SelectItem key={c.id} value={c.id!}>
                          {c.name}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Reiso numeris</FieldLabel>

                  <Input {...field} />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="departureTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Išvykimo laikas</FieldLabel>

                  <Input {...field} type="datetime-local" />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="arrivalTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Atvykimo laikas</FieldLabel>

                  <Input {...field} type="datetime-local" />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <Controller
            name="hasArrived"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label className="text-sm font-medium">
                  Lėktuvas jau atvyko
                </label>
              </div>
            )}
          />
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={props.onClose} type="button">
            Atšaukti
          </Button>

          <Button type="submit" form="edit-schedule-form">
            Išsaugoti pakeitimus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
