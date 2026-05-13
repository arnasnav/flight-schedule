"use client"

import type {
  Control,
  UseFieldArrayReturn,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form"

import type { IEditScheduleFormFieldsRestProps } from "@/types/props/schedule"

import type { AddScheduleFormValues } from "./schedule-form-schema"
import { ScheduleFormTechnicalFields } from "./schedule-form-technical-fields"
import { ScheduleStopoverAirportsFields } from "./schedule-stopover-airports-fields"

export function EditScheduleFormFieldsRest(props: IEditScheduleFormFieldsRestProps) {
  const {
    control,
    setValue,
    getValues,
    airports,
    statuses,
    terminals,
    aircrafts,
    stopovers,
  } = props

  return (
    <>
      <div className="col-span-full pt-2">
        <p className="text-sm font-semibold">
          Skrydžio būsena ir techninė informacija
        </p>
      </div>
      <ScheduleFormTechnicalFields
        control={control as unknown as Control<AddScheduleFormValues>}
        setValue={setValue as unknown as UseFormSetValue<AddScheduleFormValues>}
        getValues={getValues as unknown as UseFormGetValues<AddScheduleFormValues>}
        statuses={statuses}
        terminals={terminals}
        aircrafts={aircrafts}
      />
      <ScheduleStopoverAirportsFields
        control={control as unknown as Control<AddScheduleFormValues>}
        stopovers={
          stopovers as unknown as UseFieldArrayReturn<
            AddScheduleFormValues,
            "stopoverAirports"
          >
        }
        airports={airports}
      />
    </>
  )
}
