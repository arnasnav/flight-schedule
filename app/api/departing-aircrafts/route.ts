import { NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

export async function GET(request: Request) {
  const searchQuery = new URL(request.url).searchParams
  const airportId = searchQuery.get("airportId")

  await connectMongoose()
  const aircraftTypes = await Schedule.distinct("aircraftType", {
    airportId,
  })

  return NextResponse.json(aircraftTypes)
}
