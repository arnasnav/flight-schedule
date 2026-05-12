import { NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

export async function GET(request: Request) {
  const searchQuery = new URL(request.url).searchParams
  const companyId = searchQuery.get("companyId")

  await connectMongoose()
  const flights = await Schedule.find({ companyId }).sort({ departureTime: 1 })

  return NextResponse.json(flights)
}
