export type IRouteLeg = {
  tripId: string
  routeName: string
  fromStopId: string
  toStopId: string
  fromStopName: string
  toStopName: string
  departureTime: Date
  arrivalTime: Date
}

export type IFlightOption = {
  flightIata: string
  departureTime: Date
  airline: string
  destinationIata: string
}

export type ChainStatus = "speja" | "rizikinga" | "nespeja"

export type ITravelChainResult = {
  intercityLeg: IRouteLeg
  cityLeg: IRouteLeg
  selectedFlight: IFlightOption
  reserveMinutes: number
  status: ChainStatus
  statusLabel: string
}
