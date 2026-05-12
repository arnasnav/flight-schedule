import { NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

type TransitAirport = {
  code: string
  name: string
}

export async function GET(request: Request) {
  const searchQuery = new URL(request.url).searchParams
  const destinationAirportId = searchQuery.get("destinationAirportId")

  if (!destinationAirportId) {
    return NextResponse.json(
      { message: "Missing required query parameter: destinationAirportId" },
      { status: 400 }
    )
  }

  await connectMongoose()
  const schedules = await Schedule.find(
    { arrivalAirportId: destinationAirportId },
    { stopoverAirports: 1, _id: 0 }
  ).lean()

  const uniqueMap = new Map<string, TransitAirport>()

  for (const schedule of schedules) {
    for (const stopover of schedule.stopoverAirports ?? []) {
      uniqueMap.set(stopover.code, {
        code: stopover.code,
        name: stopover.name,
      })
    }
  }

  return NextResponse.json(Array.from(uniqueMap.values()))
}
