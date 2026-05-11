import { Terminal } from "@/models/terminal-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"

export async function GET() {
  await connectMongoose()
  const terminals = await Terminal.find().sort({ name: 1 })
  return NextResponse.json(terminals)
}
