import { NextRequest, NextResponse } from "next/server"
import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  await connectMongoose()
  const flights = await Schedule.find({ companyId }).sort({ departureTime: 1 })

  return NextResponse.json(flights)
}
