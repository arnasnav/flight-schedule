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
    flightId: body.flightId ?? body.flightNumber,
    airportId: body.airportId,
    departureAirportCode: body.departureAirportCode ?? "",
    departureAirportName: body.departureAirportName ?? "",
    companyId: body.companyId,
    airlineCode: body.airlineCode ?? "",
    airlineName: body.airlineName ?? "",
    flightNumber: body.flightNumber,
    departureTime: body.departureTime ?? body.scheduledDepartureTime,
    scheduledDepartureTime: body.scheduledDepartureTime ?? body.departureTime,
    actualDepartureTime: body.actualDepartureTime ?? body.departureTime,
    arrivalAirportId: body.arrivalAirportId,
    arrivalTime: body.arrivalTime ?? body.scheduledArrivalTime,
    arrivalAirportCode: body.arrivalAirportCode ?? "",
    arrivalAirportName: body.arrivalAirportName ?? "",
    scheduledArrivalTime: body.scheduledArrivalTime ?? body.arrivalTime,
    actualArrivalTime: body.actualArrivalTime ?? body.arrivalTime,
    flightStatus: body.flightStatus ?? (body.hasArrived ? "Arrived" : "Scheduled"),
    terminal: body.terminal ?? "",
    gate: body.gate ?? "",
    aircraftType: body.aircraftType ?? "",
    seatCount: body.seatCount ?? 0,
    availableSeatCount: body.availableSeatCount ?? 0,
    flightPrice: body.flightPrice ?? 0,
    baggageLimit: body.baggageLimit ?? "",
    stopoverAirports: body.stopoverAirports ?? [],
    hasArrived: body.hasArrived ?? false,
  })

  return NextResponse.json(newSchedule)
}