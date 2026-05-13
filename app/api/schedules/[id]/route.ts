import { ScheduleService } from "@/services/schedule-service"

export async function PUT(request: Request) {
  const body = await request.json()

  const scheduleService = new ScheduleService()
  await scheduleService.updateSchedule(body)

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/schedules/[id]">,
) {
  const { id } = await ctx.params

  const scheduleService = new ScheduleService()
  await scheduleService.deleteSchedule(id)

  return Response.json({ message: "Deleted successfully" })
}
