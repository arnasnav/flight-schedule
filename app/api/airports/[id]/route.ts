import { AirportService } from "@/services/airport-service"
import { IAirport } from "@/models/airport-model"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const airportService = new AirportService()
  await airportService.deleteAirport(id)

  return Response.json({ message: "Deleted successfully" })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const body = await request.json()

  const airportService = new AirportService()

  await airportService.updateAirport({
    id: id,
    ...body,
  } as IAirport)

  return Response.json({ message: "Updated successfully" })
}
