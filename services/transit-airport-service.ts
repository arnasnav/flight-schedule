import { Schedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"
import type { ITransitAirport } from "@/types/transit-airport"

export async function getTransitAirportsForDestination(
  destinationAirportId: string | null,
): Promise<ITransitAirport[]> {
  const id = destinationAirportId?.trim()
  if (!id) {
    return []
  }

  await connectMongoose()

  const rows = await Schedule.aggregate<ITransitAirport>([
    { $match: { arrivalAirportId: id } },
    { $unwind: "$stopoverAirports" },
    {
      $group: {
        _id: "$stopoverAirports.code",
        code: { $first: "$stopoverAirports.code" },
        name: { $first: "$stopoverAirports.name" },
      },
    },
    { $sort: { code: 1 } },
    { $project: { _id: 0, code: 1, name: 1 } },
  ])

  return rows
}
