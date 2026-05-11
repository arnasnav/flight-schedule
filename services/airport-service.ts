import { Airport } from "@/models/airport-model"
import type { IAirport } from "@/models/airport-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { Types } from "mongoose"

export class AirportService {
  async getAirports(): Promise<IAirport[]> {
    await connectMongoose()
    const airports = await Airport.find().sort({ name: 1 })
    return airports
  }

  async saveAirport(airport: IAirport): Promise<void> {
    await connectMongoose()
    await Airport.create(airport)
  }

  async createAirport(data: Partial<IAirport>): Promise<void> {
    await connectMongoose()
    const newAirport = new Airport(data)
    await newAirport.save()
  }

  async updateAirport(airport: IAirport): Promise<void> {
    await connectMongoose()
    const { id, ...updateData } = airport
    await Airport.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateData }
    )
  }

  async deleteAirport(id: string): Promise<void> {
    await connectMongoose()
    await Airport.findByIdAndDelete(id)
  }
}
