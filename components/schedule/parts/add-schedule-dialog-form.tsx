"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { IAirport } from "@/models/airport-model"
import type { IAircraft } from "@/models/aircraft-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { IStatus } from "@/models/status-model"
import type { ITerminal } from "@/models/terminal-model"

import { AddScheduleFormFieldsMain } from "./add-schedule-form-fields-main"
import { AddScheduleFormFieldsRest } from "./add-schedule-form-fields-rest"
import {
  createAddScheduleFormSchema,
  type AddScheduleFormValues,
} from "./schedule-form-schema"

type IProps = {
  onClose: () => void
  onConfirm: (data: ISchedule) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export function AddScheduleDialogForm({
  onClose,
  onConfirm,
  airports,
  companies,
  existingSchedules,
  statuses,
  terminals,
  aircrafts,
}: IProps) {
  const formSchema = createAddScheduleFormSchema(existingSchedules)

  const form = useForm<AddScheduleFormValues>({
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

  const { control, setValue, getValues } = form

  const stopovers = useFieldArray({
    control,
    name: "stopoverAirports",
  })

  const onSubmit: SubmitHandler<AddScheduleFormValues> = async (data) => {
    const formattedStopovers = data.stopoverAirports.map((s) => {
      const airport = airports.find((a) => a.id === s.airportId)
      return {
        code: airport?.code || "",
        name: airport?.name || "",
      }
    })
    await onConfirm({
      ...data,
      stopoverAirports: formattedStopovers,
      seatCount: Number(data.seatCount),
      availableSeatCount: Number(data.availableSeatCount),
      flightPrice: Number(data.flightPrice),
    })
    toast.success("Skrydis sėkmingai pridėtas")
    form.reset()
    onClose()
  }

  return (
    <>
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
          <AddScheduleFormFieldsMain
            control={control}
            airports={airports}
            companies={companies}
          />
          <AddScheduleFormFieldsRest
            control={control}
            setValue={setValue}
            getValues={getValues}
            airports={airports}
            statuses={statuses}
            terminals={terminals}
            aircrafts={aircrafts}
            stopovers={stopovers}
          />
        </div>

        <Controller
          name="hasArrived"
          control={control}
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
        <Button variant="outline" onClick={onClose}>
          Atšaukti
        </Button>

        <Button type="submit" form="add-schedule-form">
          Išsaugoti
        </Button>
      </DialogFooter>
    </>
  )
}
