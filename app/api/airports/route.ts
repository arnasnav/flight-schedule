import { Airport } from "@/models/airport-model"
import type { IAirport } from "@/models/airport-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import type { IWithStringId } from "@/models/model-t"
import { AirportService } from "@/services/airport-service"

export async function GET(): Promise<NextResponse<IWithStringId<IAirport>[]>> {
  await connectMongoose()
  const airports = await Airport.find()
  return NextResponse.json(airports)
}

export async function POST(request: Request) {
  await connectMongoose()
  const body = await request.json()

  const newAirport = await Airport.create(body)

  return NextResponse.json(newAirport)
}

export async function PUT(request: Request) {
  const body = await request.json()

  const airportService = new AirportService()

  await airportService.updateAirport(body)

  return Response.json({ message: "Updated successfully" })
}