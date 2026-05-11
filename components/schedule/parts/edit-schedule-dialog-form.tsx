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

import { EditScheduleFormFieldsMain } from "./edit-schedule-form-fields-main"
import { EditScheduleFormFieldsRest } from "./edit-schedule-form-fields-rest"
import {
  createEditScheduleFormSchema,
  type EditScheduleFormValues,
} from "./schedule-form-schema"

type IProps = {
  schedule: ISchedule
  onClose: () => void
  onConfirm: (data: ISchedule) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export function EditScheduleDialogForm(props: IProps) {
  const {
    schedule,
    onClose,
    onConfirm,
    airports,
    companies,
    existingSchedules,
    statuses,
    terminals,
    aircrafts,
  } = props

  const scheduleId = schedule.id ?? ""
  const formSchema = createEditScheduleFormSchema(scheduleId, existingSchedules)

  const form = useForm<EditScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...schedule,
      seatCount: String(schedule.seatCount ?? 0),
      availableSeatCount: String(schedule.availableSeatCount ?? 0),
      flightPrice: String(schedule.flightPrice ?? 0),
      stopoverAirports: (schedule.stopoverAirports ?? []).map((s) => {
        const airport = airports.find(
          (a) => a.code === s.code || a.name === s.name,
        )
        return { airportId: airport?.id ?? "" }
      }),
    },
  })

  const { control, setValue, getValues } = form

  const stopovers = useFieldArray({
    control,
    name: "stopoverAirports",
  })

  const onSubmit: SubmitHandler<EditScheduleFormValues> = async (data) => {
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
    toast.success("Skrydžio informacija sėkmingai atnaujinta")
    form.reset()
    onClose()
  }

  return (
    <>
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
          <EditScheduleFormFieldsMain
            control={control}
            airports={airports}
            companies={companies}
          />
          <EditScheduleFormFieldsRest
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
            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label className="text-sm font-medium">Lėktuvas jau atvyko</label>
            </div>
          )}
        />
      </form>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} type="button">
          Atšaukti
        </Button>

        <Button type="submit" form="edit-schedule-form">
          Išsaugoti pakeitimus
        </Button>
      </DialogFooter>
    </>
  )
}
