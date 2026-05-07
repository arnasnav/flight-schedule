import { Schedule, ISchedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import { WithStringId } from "@/models/model-t"

export async function GET(): Promise<NextResponse<WithStringId<ISchedule>[]>> {
  await connectMongoose()
  const schedules = await Schedule.find()
  return NextResponse.json(schedules)
}

export async function POST(request: Request) {
  await connectMongoose()
  const body = await request.json()

  const newSchedule = await Schedule.create({
    airportId: body.airportId,
    companyId: body.companyId,
    flightNumber: body.flightNumber,
    departureTime: body.departureTime,
    arrivalAirportId: body.arrivalAirportId,
    arrivalTime: body.arrivalTime,
    hasArrived: body.hasArrived ?? false,
  })

  return NextResponse.json(newSchedule)
}
