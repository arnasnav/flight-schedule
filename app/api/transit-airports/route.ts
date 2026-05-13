import { NextRequest, NextResponse } from "next/server"
import { getTransitAirportsForDestination } from "@/services/transit-airport-service"

export async function GET(request: NextRequest) {
  const destinationAirportId = request.nextUrl.searchParams.get(
    "destinationAirportId",
  )

  const airports = await getTransitAirportsForDestination(destinationAirportId)

  return NextResponse.json(airports)
}
