import { NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

export async function GET(request: Request) {
  const searchQuery = new URL(request.url).searchParams
  const airportId = searchQuery.get("airportId")

  if (!airportId) {
    return NextResponse.json(
      { message: "Missing required query parameter: airportId" },
      { status: 400 }
    )
  }

  await connectMongoose()
  const flights = await Schedule.find({ airportId }).sort({ departureTime: 1 })

  return NextResponse.json(flights)
}
