"use client"

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

type IProps = {
  onClose: () => void
  onConfirm: (data: any) => void
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
}

export function AddScheduleDialog(props: IProps) {
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
              (s) => s.flightNumber.toLowerCase() === val.trim().toLowerCase()
            ),
          { message: "Šis reiso numeris jau egzistuoja" }
        ),
      departureTime: z.string().min(1),
      arrivalAirportId: z.string().min(1),
      arrivalTime: z.string().min(1),
      hasArrived: z.boolean(),
    })
    .refine((data) => data.airportId !== data.arrivalAirportId, {
      message: "Oro uostai negali sutapti",
      path: ["arrivalAirportId"],
    })
    .refine(
      (data) => {
        const dep = parseISO(data.departureTime)
        const arr = parseISO(data.arrivalTime)
        return isBefore(dep, arr)
      },
      {
        message: "Išvykimas turi būti prieš atvykimą",
        path: ["arrivalTime"],
      }
    )
    .refine(
      (data) => {
        const newDep = parseISO(data.departureTime)

        const sameAirportFlights = props.existingSchedules.filter(
          (s) => s.airportId === data.airportId
        )

        const sameTimeFlights = sameAirportFlights.filter(
          (s) => parseISO(s.departureTime).getTime() === newDep.getTime()
        )

        if (sameTimeFlights.length >= 2) return false

        const tooClose = sameAirportFlights.some((s) => {
          const diff = Math.abs(
            differenceInMinutes(parseISO(s.departureTime), newDep)
          )
          return diff > 0 && diff < 20
        })

        return !tooClose
      },
      {
        message: "Per daug skrydžių arba per mažas tarpas (<20 min)",
        path: ["departureTime"],
      }
    )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airportId: "",
      companyId: "",
      flightNumber: "",
      departureTime: "",
      arrivalAirportId: "",
      arrivalTime: "",
      hasArrived: false,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    props.onConfirm(data)
    toast.success("Skrydis sėkmingai pridėtas")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pridėti skrydį</DialogTitle>
          <DialogDescription>Įveskite skrydžio informaciją</DialogDescription>
        </DialogHeader>

        <form
          id="add-schedule-form"
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <Select value={field.value} onValueChange={field.onChange}>
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
              <div className="flex items-center space-x-2">
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
          <Button variant="outline" onClick={props.onClose}>
            Atšaukti
          </Button>

          <Button type="submit" form="add-schedule-form">
            Išsaugoti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
