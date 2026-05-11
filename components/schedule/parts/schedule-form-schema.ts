import { differenceInMinutes, isBefore, parseISO } from "date-fns"
import * as z from "zod"

import type { ISchedule } from "@/models/schedule-model"

export function createAddScheduleFormSchema(existingSchedules: ISchedule[]) {
  return z
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
            !existingSchedules.some(
              (s) => s.flightNumber.toLowerCase() === val.trim().toLowerCase(),
            ),
          { message: "Šis reiso numeris jau egzistuoja" },
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
        }),
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
      },
    )
    .refine(
      (data) => {
        const newDep = parseISO(data.departureTime)

        const sameAirportFlights = existingSchedules.filter(
          (s) => s.airportId === data.airportId,
        )

        const sameTimeFlights = sameAirportFlights.filter(
          (s) => parseISO(s.departureTime).getTime() === newDep.getTime(),
        )

        if (sameTimeFlights.length >= 2) return false

        const tooClose = sameAirportFlights.some((s) => {
          const diff = Math.abs(
            differenceInMinutes(parseISO(s.departureTime), newDep),
          )
          return diff > 0 && diff < 20
        })

        return !tooClose
      },
      {
        message: "Per daug skrydžių arba per mažas tarpas (<20 min)",
        path: ["departureTime"],
      },
    )
    .refine(
      (data) => Number(data.availableSeatCount) <= Number(data.seatCount),
      {
        message: "Laisvų vietų negali būti daugiau nei vietų skaičius",
        path: ["availableSeatCount"],
      },
    )
}

export function createEditScheduleFormSchema(
  currentScheduleId: string,
  existingSchedules: ISchedule[],
) {
  return z
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
            !existingSchedules.some(
              (s) =>
                s.id !== currentScheduleId &&
                s.flightNumber.toLowerCase() === val.toLowerCase(),
            ),
          { message: "Šis reiso numeris jau egzistuoja" },
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
        }),
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
      },
    )
    .refine(
      (data) => Number(data.availableSeatCount) <= Number(data.seatCount),
      {
        message: "Laisvų vietų negali būti daugiau nei vietų skaičius",
        path: ["availableSeatCount"],
      },
    )
}

export type AddScheduleFormValues = z.infer<
  ReturnType<typeof createAddScheduleFormSchema>
>

export type EditScheduleFormValues = z.infer<
  ReturnType<typeof createEditScheduleFormSchema>
>
