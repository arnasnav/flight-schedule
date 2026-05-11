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
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { IStatus } from "@/models/status-model"

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
}

export function EditScheduleDialogForm({
  schedule,
  onClose,
  onConfirm,
  airports,
  companies,
  existingSchedules,
  statuses,
}: IProps) {
  const scheduleId = schedule.id ?? ""
  const formSchema = createEditScheduleFormSchema(scheduleId, existingSchedules)

  const form = useForm<EditScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...schedule,
      seatCount: String(schedule.seatCount ?? 0),
      availableSeatCount: String(schedule.availableSeatCount ?? 0),
      flightPrice: String(schedule.flightPrice ?? 0),
      stopoverAirports: schedule.stopoverAirports ?? [],
    },
  })

  const stopovers = useFieldArray({
    control: form.control,
    name: "stopoverAirports",
  })

  const onSubmit: SubmitHandler<EditScheduleFormValues> = async (data) => {
    await onConfirm({
      ...data,
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
            control={form.control}
            airports={airports}
            companies={companies}
          />
          <EditScheduleFormFieldsRest
            control={form.control}
            statuses={statuses}
            stopovers={stopovers}
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
