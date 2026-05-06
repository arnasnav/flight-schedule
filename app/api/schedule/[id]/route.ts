import { ScheduleService } from "@/services/schedule-service"
import { ISchedule } from "@/models/schedule-model"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const scheduleService = new ScheduleService()
  await scheduleService.deleteSchedule(id)

  return Response.json({ message: "Deleted successfully" })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const body = await request.json()

  const scheduleService = new ScheduleService()

  await scheduleService.updateSchedule({
    id: id,
    ...body,
  } as ISchedule)

  return Response.json({ message: "Updated successfully" })
}
