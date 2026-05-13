import { NextRequest, NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const airportId = searchParams.get('airportId')

  await connectMongoose()
  const aircraftTypes = await Schedule.distinct("aircraftType", {
    airportId,
  })

  return NextResponse.json(aircraftTypes)
}
