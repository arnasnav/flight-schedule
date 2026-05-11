import { Aircraft } from "@/models/aircraft-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"

export async function GET() {
  await connectMongoose()
  const aircraft = await Aircraft.find().sort({ name: 1 })
  return NextResponse.json(aircraft)
}
