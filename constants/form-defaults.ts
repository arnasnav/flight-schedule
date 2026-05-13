import type { AddScheduleFormValues } from "@/components/schedule/parts/schedule-form-schema"

export const ADD_SCHEDULE_FORM_DEFAULTS: AddScheduleFormValues = {
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
}

export const EMPTY_NAME_CODE_FORM_DEFAULTS = {
  name: "",
  code: "",
} as const
