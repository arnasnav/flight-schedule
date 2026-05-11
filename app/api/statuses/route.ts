import { Status } from "@/models/status-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"

export async function GET() {
  await connectMongoose()
  const statuses = await Status.find().sort({ name: 1 })
  return NextResponse.json(statuses)
}