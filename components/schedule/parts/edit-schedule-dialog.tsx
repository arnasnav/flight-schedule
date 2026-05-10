"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { isBefore, parseISO } from "date-fns"

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
  onConfirm: (data: any) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
}

export function EditScheduleDialog(props: IProps) {
  const flightStatusOptions = [
    "Suplanuotas",
    "Laipinimas",
    "Vartai uždaryti",
    "Išskrido",
    "Vėluoja",
    "Atvyko",
    "Atšauktas",
  ]

  const formSchema = z
    .object({
      airportId: z.string().min(1, "Pasirinkite išvykimo oro uostą"),
      companyId: z.string().min(1, "Pasirinkite kompaniją"),
      flightId: z.string().trim().min(1, "Įveskite skrydžio ID"),
      departureAirportCode: z.string().trim().min(1, "Įveskite kodą"),
      departureAirportName: z.string().trim().min(1, "Įveskite pavadinimą"),
      arrivalAirportCode: z.string().trim().min(1, "Įveskite kodą"),
      arrivalAirportName: z.string().trim().min(1, "Įveskite pavadinimą"),
      airlineCode: z.string().trim().min(1, "Įveskite kodą"),
      airlineName: z.string().trim().min(1, "Įveskite pavadinimą"),
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
      scheduledDepartureTime: z.string().min(1),
      actualDepartureTime: z.string().min(1),
      scheduledArrivalTime: z.string().min(1),
      actualArrivalTime: z.string().min(1),
      flightStatus: z.string().trim().min(1),
      terminal: z.string().trim().min(1),
      gate: z.string().trim().min(1),
      aircraftType: z.string().trim().min(1),
      seatCount: z
        .string()
        .trim()
        .min(1, "Įveskite vietų skaičių")
        .refine((value) => !Number.isNaN(Number(value)), "Įveskite skaičių")
        .refine((value) => Number(value) >= 0, "Turi būti teigiamas skaičius"),
      availableSeatCount: z
        .string()
        .trim()
        .min(1, "Įveskite laisvų vietų skaičių")
        .refine((value) => !Number.isNaN(Number(value)), "Įveskite skaičių")
        .refine((value) => Number(value) >= 0, "Turi būti teigiamas skaičius"),
      flightPrice: z
        .string()
        .trim()
        .min(1, "Įveskite kainą")
        .refine((value) => !Number.isNaN(Number(value)), "Įveskite skaičių")
        .refine((value) => Number(value) >= 0, "Turi būti teigiamas skaičius"),
      baggageLimit: z.string().trim().min(1),
      stopoverAirports: z.array(
        z.object({
          code: z.string().trim().min(1, "Įveskite kodą"),
          name: z.string().trim().min(1, "Įveskite pavadinimą"),
        })
      ),
      hasArrived: z.boolean(),
    })
    .refine((data) => data.airportId !== data.arrivalAirportId, {
      message: "Išvykimo ir atvykimo oro uostai negali sutapti",
      path: ["arrivalAirportId"],
    })
    .refine(
      (data) => {
        const dep = parseISO(data.scheduledDepartureTime)
        const arr = parseISO(data.scheduledArrivalTime)
        return isBefore(dep, arr)
      },
      {
        message: "Išvykimo laikas turi būti ankstesnis už atvykimo",
        path: ["scheduledArrivalTime"],
      }
    )
    .refine(
      (data) => Number(data.availableSeatCount) <= Number(data.seatCount),
      {
      message: "Laisvų vietų negali būti daugiau nei vietų skaičius",
      path: ["availableSeatCount"],
    })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })
  const stopovers = useFieldArray({
    control: form.control,
    name: "stopoverAirports",
  })

  React.useEffect(() => {
    form.reset({
      ...props.schedule,
      seatCount: String(props.schedule.seatCount ?? 0),
      availableSeatCount: String(props.schedule.availableSeatCount ?? 0),
      flightPrice: String(props.schedule.flightPrice ?? 0),
      stopoverAirports: props.schedule.stopoverAirports ?? [],
    })
  }, [props.schedule, form])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await props.onConfirm({
      ...data,
      seatCount: Number(data.seatCount),
      availableSeatCount: Number(data.availableSeatCount),
      flightPrice: Number(data.flightPrice),
    })
    toast.success("Skrydžio informacija sėkmingai atnaujinta")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full pt-1">
              <p className="text-sm font-semibold">Pagrindinė informacija</p>
            </div>
            <Controller
              name="airportId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Išvykimo oro uostas</FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite išvykimo oro uostą (pvz. Vilnius)" />
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
                      <SelectValue placeholder="Pasirinkite atvykimo oro uostą (pvz. Ryga)" />
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
                      <SelectValue placeholder="Pasirinkite kompaniją (pvz. Ryanair)" />
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

                  <Input {...field} placeholder="pvz. FR2871" />

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="flightId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Skrydžio ID</FieldLabel>
                  <Input {...field} placeholder="pvz. FLIGHT-2026-0001" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="col-span-full pt-2">
              <p className="text-sm font-semibold">Laikai</p>
            </div>

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
              name="scheduledDepartureTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Planuotas išvykimo laikas</FieldLabel>
                  <Input {...field} type="datetime-local" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="actualDepartureTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Faktinis išvykimo laikas</FieldLabel>
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
            <Controller
              name="scheduledArrivalTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Planuotas atvykimo laikas</FieldLabel>
                  <Input {...field} type="datetime-local" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="actualArrivalTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Faktinis atvykimo laikas</FieldLabel>
                  <Input {...field} type="datetime-local" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="col-span-full pt-2">
              <p className="text-sm font-semibold">Maršrutas ir aviakompanija</p>
            </div>
            <Controller
              name="departureAirportCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Išvykimo oro uosto kodas</FieldLabel>
                  <Input {...field} placeholder="pvz. VNO" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="departureAirportName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Išvykimo oro uosto pavadinimas</FieldLabel>
                  <Input {...field} placeholder="pvz. Vilniaus oro uostas" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="arrivalAirportCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Atvykimo oro uosto kodas</FieldLabel>
                  <Input {...field} placeholder="pvz. RIX" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="arrivalAirportName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Atvykimo oro uosto pavadinimas</FieldLabel>
                  <Input {...field} placeholder="pvz. Rygos oro uostas" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="airlineCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Aviakompanijos kodas</FieldLabel>
                  <Input {...field} placeholder="pvz. FR" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="airlineName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Aviakompanijos pavadinimas</FieldLabel>
                  <Input {...field} placeholder="pvz. Ryanair" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="col-span-full pt-2">
              <p className="text-sm font-semibold">Skrydžio būsena ir techninė informacija</p>
            </div>
            <Controller
              name="flightStatus"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Skrydžio būsena</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite būseną" />
                    </SelectTrigger>
                    <SelectContent>
                      {flightStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Skrydžio kaina</FieldLabel>
                  <Input {...field} type="number" step="0.01" placeholder="pvz. 129.99" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="baggageLimit"
              control={form.control}
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
                    control={form.control}
                    render={({ field: inputField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input {...inputField} placeholder="Kodas (pvz. RIX)" />
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                  <Controller
                    name={`stopoverAirports.${index}.name`}
                    control={form.control}
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
