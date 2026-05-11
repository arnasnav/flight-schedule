"use client"

import type { Control, UseFieldArrayReturn, UseFormGetValues, UseFormSetValue } from "react-hook-form"

import type { IAircraft } from "@/models/aircraft-model"
import type { IAirport } from "@/models/airport-model"
import type { IStatus } from "@/models/status-model"
import type { ITerminal } from "@/models/terminal-model"

import type { AddScheduleFormValues } from "./schedule-form-schema"
import { ScheduleFormTechnicalFields } from "./schedule-form-technical-fields"
import { ScheduleStopoverAirportsFields } from "./schedule-stopover-airports-fields"

type IProps = {
  control: Control<AddScheduleFormValues>
  setValue: UseFormSetValue<AddScheduleFormValues>
  getValues: UseFormGetValues<AddScheduleFormValues>
  airports: IAirport[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
  stopovers: UseFieldArrayReturn<AddScheduleFormValues, "stopoverAirports">
}

export function AddScheduleFormFieldsRest({
  control,
  setValue,
  getValues,
  airports,
  statuses,
  terminals,
  aircrafts,
  stopovers,
}: IProps) {
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
