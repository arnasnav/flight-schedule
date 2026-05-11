import { ScheduleService } from "@/services/schedule-service"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const scheduleService = new ScheduleService()
  await scheduleService.deleteSchedule(id)

  return Response.json({ message: "Deleted successfully" })
}