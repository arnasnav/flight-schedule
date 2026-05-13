import { NextRequest, NextResponse } from "next/server"
import {
  buildTravelChain,
  getVnoDepartures,
} from "@/services/travel-chain-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("mode")

  if (mode === "flights") {
    const departures = await getVnoDepartures()
    return NextResponse.json(departures)
  }

  const flightIata = searchParams.get("flightIata") || undefined
  const chain = await buildTravelChain(flightIata)

  return NextResponse.json({
    intercityLeg: {
      ...chain.intercityLeg,
      departureTime: chain.intercityLeg.departureTime.toISOString(),
      arrivalTime: chain.intercityLeg.arrivalTime.toISOString(),
    },
    cityLeg: {
      ...chain.cityLeg,
      departureTime: chain.cityLeg.departureTime.toISOString(),
      arrivalTime: chain.cityLeg.arrivalTime.toISOString(),
    },
    selectedFlight: {
      ...chain.selectedFlight,
      departureTime: chain.selectedFlight.departureTime.toISOString(),
    },
    reserveMinutes: chain.reserveMinutes,
    status: chain.status,
    statusLabel: chain.statusLabel,
  })
}
