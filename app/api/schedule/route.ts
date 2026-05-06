import { Schedule, ISchedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import { WithStringId } from "@/models/model-t"

// GET: Gauti visus skrydžius
export async function GET(): Promise<NextResponse<WithStringId<ISchedule>[]>> {
  try {
    await connectMongoose()
    const schedules = await Schedule.find()
    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Klaida gaunant tvarkaraštį:", error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST: Pridėti naują skrydį
export async function POST(request: Request) {
  try {
    await connectMongoose()
    const body = await request.json()

    // Sukuriame naują skrydį pagal gautą kūną (body)
    // Mongoose automatiškai patikrins 'required' laukus ir 'unique' flightNumber
    const newSchedule = new Schedule({
      airportId: body.airportId,
      companyId: body.companyId,
      flightNumber: body.flightNumber,
      departureTime: body.departureTime,
      arrivalAirportId: body.arrivalAirportId,
      arrivalTime: body.arrivalTime,
      hasArrived: body.hasArrived ?? false,
    })

    await newSchedule.save()
    return NextResponse.json(newSchedule, { status: 201 })
  } catch (error: any) {
    console.error("Klaida saugant skrydį:", error)
    
    // Jei Mongoose meta klaidą dėl unikalaus reiso numerio (kodas 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Reiso numeris jau egzistuoja duomenų bazėje." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Serverio klaida saugant duomenis." },
      { status: 500 }
    )
  }
}