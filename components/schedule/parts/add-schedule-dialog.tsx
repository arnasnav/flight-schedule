"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form"
import type {
  SubmitHandler,
} from "react-hook-form"
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

import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import { toast } from "sonner"
import type { IStatus } from "@/models/status-model"

type IProps = {
  onClose: () => void
  onConfirm: (data: any) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
  statuses: IStatus[]
}

export function AddScheduleDialog(props: IProps) {
  const formSchema = z
    .object({
      airportId: z.string().min(1, "Pasirinkite išvykimo oro uostą"),
      companyId: z.string().min(1, "Pasirinkite kompaniją"),
      flightId: z.string().trim().min(1, "Įveskite skrydžio ID"),
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
      scheduledDepartureTime: z.string().min(1),
      actualDepartureTime: z.string().min(1),
      scheduledArrivalTime: z.string().min(1),
      actualArrivalTime: z.string().min(1),
      flightStatus: z.string().trim().min(1, "Įveskite būseną"),
      terminal: z.string().trim().min(1, "Įveskite terminalą"),
      gate: z.string().trim().min(1, "Įveskite vartus"),
      aircraftType: z.string().trim().min(1, "Įveskite tipą"),
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
      baggageLimit: z.string().trim().min(1, "Įveskite limitą"),
      stopoverAirports: z.array(
        z.object({
          airportId: z.string().min(1, "Pasirinkite oro uostą"),
        })
      ),
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
    .refine(
      (data) => Number(data.availableSeatCount) <= Number(data.seatCount),
      {
        message: "Laisvų vietų negali būti daugiau nei vietų skaičius",
        path: ["availableSeatCount"],
      }
    )

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airportId: "",
      companyId: "",
      flightId: "",
      flightNumber: "",
      departureTime: "",
      arrivalAirportId: "",
      arrivalTime: "",
      scheduledDepartureTime: "",
      actualDepartureTime: "",
      scheduledArrivalTime: "",
      actualArrivalTime: "",
      flightStatus: "",
      terminal: "",
      gate: "",
      aircraftType: "",
      seatCount: "0",
      availableSeatCount: "0",
      flightPrice: "0",
      baggageLimit: "",
      stopoverAirports: [],
      hasArrived: false,
    },
  })
  const stopovers = useFieldArray({
    control: form.control,
    name: "stopoverAirports",
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formattedStopovers = data.stopoverAirports.map((s) => {
      const airport = props.airports.find((a) => a.id === s.airportId)
      return {
        code: airport?.code || "",
        name: airport?.name || "",
      }
    })
    await props.onConfirm({
      ...data,
      stopoverAirports: formattedStopovers,
      seatCount: Number(data.seatCount),
      availableSeatCount: Number(data.availableSeatCount),
      flightPrice: Number(data.flightPrice),
    })
    toast.success("Skrydis sėkmingai pridėtas")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pridėti skrydį</DialogTitle>
          <DialogDescription>Įveskite skrydžio informaciją</DialogDescription>
        </DialogHeader>

        <form
          id="add-schedule-form"
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite išvykimo oro uostą (pvz. Vilnius)" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.airports.map((a) => (
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Atvykimo oro uostas</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite atvykimo oro uostą (pvz. Ryga)" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.airports.map((a) => (
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Kompanija</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite kompaniją (pvz. Ryanair)" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.companies.map((c) => (
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Faktinis atvykimas</FieldLabel>
                  <Input {...field} type="datetime-local" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="col-span-full pt-2">
              <p className="text-sm font-semibold">
                Skrydžio būsena ir techninė informacija
              </p>
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
                      {props.statuses.map((status) => (
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bagažo limitas</FieldLabel>
                  <Input {...field} placeholder="pvz. 20" />
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
                    control={form.control}
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
                            {props.airports.map((a) => (
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
