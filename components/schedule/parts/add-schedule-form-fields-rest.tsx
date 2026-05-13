"use client"

import type { IAddScheduleFormFieldsRestProps } from "@/types/props/schedule"

import { ScheduleFormTechnicalFields } from "./schedule-form-technical-fields"
import { ScheduleStopoverAirportsFields } from "./schedule-stopover-airports-fields"

export function AddScheduleFormFieldsRest(props: IAddScheduleFormFieldsRestProps) {
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
        control={control}
        setValue={setValue}
        getValues={getValues}
        statuses={statuses}
        terminals={terminals}
        aircrafts={aircrafts}
      />
      <ScheduleStopoverAirportsFields
        control={control}
        stopovers={stopovers}
        airports={airports}
      />
    </>
  )
}
