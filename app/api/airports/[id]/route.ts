import { AirportService } from "@/services/airport-service"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  const airportService = new AirportService()
  await airportService.updateAirport({ ...body, id })

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const airportService = new AirportService()
  await airportService.deleteAirport(id)

  return Response.json({ message: "Deleted successfully" })
}