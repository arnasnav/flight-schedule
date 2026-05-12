import { ScheduleService } from "@/services/schedule-service"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const scheduleService = new ScheduleService()
  await scheduleService.updateSchedule({ ...body, id })

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const scheduleService = new ScheduleService()
  await scheduleService.deleteSchedule(id)

  return Response.json({ message: "Deleted successfully" })
}