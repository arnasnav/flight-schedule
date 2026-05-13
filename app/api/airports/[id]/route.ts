import { AirportService } from "@/services/airport-service"

export async function PUT(request: Request) {
  const body = await request.json()

  const airportService = new AirportService()
  await airportService.updateAirport(body)

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/airports/[id]">,
) {
  const { id } = await ctx.params

  const airportService = new AirportService()
  await airportService.deleteAirport(id)

  return Response.json({ message: "Deleted successfully" })
}
