import type { Control, UseFieldArrayReturn, UseFormGetValues, UseFormSetValue } from "react-hook-form"

import type { IAircraft } from "@/models/aircraft-model"
import type { IAirport } from "@/models/airport-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { IStatus } from "@/models/status-model"
import type { ITerminal } from "@/models/terminal-model"
import type {
  AddScheduleFormValues,
  EditScheduleFormValues,
} from "@/components/schedule/parts/schedule-form-schema"

export type IScheduleProps = {
  initialSchedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export type IScheduleListProps = {
  schedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
  onEdit: (s: ISchedule) => void
  onDelete: (id: string) => void
}

export type IAddScheduleDialogProps = {
  onClose: () => void
  onConfirm: (data: ISchedule) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export type IEditScheduleDialogProps = {
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

export type IScheduleFormTechnicalFieldsProps = {
  control: Control<AddScheduleFormValues>
  setValue: UseFormSetValue<AddScheduleFormValues>
  getValues: UseFormGetValues<AddScheduleFormValues>
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export type IAddScheduleFormFieldsMainProps = {
  control: Control<AddScheduleFormValues>
  airports: IAirport[]
  companies: ICompany[]
}

export type IAddScheduleFormFieldsRestProps = {
  control: Control<AddScheduleFormValues>
  setValue: UseFormSetValue<AddScheduleFormValues>
  getValues: UseFormGetValues<AddScheduleFormValues>
  airports: IAirport[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
  stopovers: UseFieldArrayReturn<AddScheduleFormValues, "stopoverAirports">
}

export type IEditScheduleFormFieldsMainProps = {
  control: Control<EditScheduleFormValues>
  airports: IAirport[]
  companies: ICompany[]
}

export type IEditScheduleFormFieldsRestProps = {
  control: Control<EditScheduleFormValues>
  setValue: UseFormSetValue<EditScheduleFormValues>
  getValues: UseFormGetValues<EditScheduleFormValues>
  airports: IAirport[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
  stopovers: UseFieldArrayReturn<EditScheduleFormValues, "stopoverAirports">
}

export type IScheduleStopoverAirportsFieldsProps = {
  control: Control<AddScheduleFormValues>
  stopovers: UseFieldArrayReturn<AddScheduleFormValues, "stopoverAirports">
  airports: IAirport[]
}
