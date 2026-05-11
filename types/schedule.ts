export interface ISchedule {
  id: string
  flightId: string
  airportId: string
  departureAirportCode: string
  departureAirportName: string
  companyId: string
  airlineCode: string
  airlineName: string
  flightNumber: string
  departureTime: string
  scheduledDepartureTime: string
  actualDepartureTime: string
  arrivalAirportId: string
  arrivalTime: string
  arrivalAirportCode: string
  arrivalAirportName: string
  scheduledArrivalTime: string
  actualArrivalTime: string
  flightStatus: string
  terminal: string
  gate: string
  aircraftType: string
  seatCount: number
  availableSeatCount: number
  flightPrice: number
  baggageLimit: string
  stopoverAirports: { code: string; name: string }[]
  hasArrived: boolean
}