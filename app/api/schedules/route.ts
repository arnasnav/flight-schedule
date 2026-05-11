import { NextResponse } from "next/server"
import { ScheduleService } from "@/services/schedule-service"
import type { IWithStringId } from "@/models/model-t"
import { Schedule, type ISchedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"

const service = new ScheduleService()

export async function GET(): Promise<NextResponse<IWithStringId<ISchedule>[]>> {
  await connectMongoose()
  const schedules = await Schedule.find()
  return NextResponse.json(schedules)
}

export async function POST(request: Request) {
  const body = await request.json()

  const schedule = await service.createFromRequest(body)

  return NextResponse.json(schedule)
}

export async function PUT(request: Request) {
  const body = await request.json()

  const scheduleService = new ScheduleService()

  await scheduleService.updateSchedule(body)

  return Response.json({ message: "Updated successfully" })
}