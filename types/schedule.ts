export interface ISchedule {
  id: string
  airportId: string
  companyId: string
  flightNumber: string
  departureTime: string
  arrivalAirportId: string
  arrivalTime: string
  hasArrived: boolean
}