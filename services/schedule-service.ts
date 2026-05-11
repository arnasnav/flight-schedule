import { Schedule } from "@/models/schedule-model"
import type { ISchedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { Types } from "mongoose"

export class ScheduleService {
  async getSchedules(): Promise<ISchedule[]> {
    await connectMongoose()
    return Schedule.find().sort({ departureTime: 1 })
  }

  async createFromRequest(body: ISchedule): Promise<ISchedule> {
    await connectMongoose()

    const newSchedule = await Schedule.create({
      flightId: body.flightId,
      flightNumber: body.flightNumber,

      airportId: body.airportId,
      companyId: body.companyId,

      departureTime: body.departureTime,
      scheduledDepartureTime: body.scheduledDepartureTime,
      actualDepartureTime: body.actualDepartureTime,

      arrivalAirportId: body.arrivalAirportId,
      arrivalTime: body.arrivalTime,
      scheduledArrivalTime: body.scheduledArrivalTime,
      actualArrivalTime: body.actualArrivalTime,

      flightStatus: body.flightStatus,
      terminal: body.terminal,
      gate: body.gate,
      aircraftType: body.aircraftType,
      seatCount: body.seatCount,
      availableSeatCount: body.availableSeatCount,
      flightPrice: body.flightPrice,
      baggageLimit: body.baggageLimit,
      stopoverAirports: body.stopoverAirports,
      hasArrived: body.hasArrived,
    })

    return newSchedule
  }

  async updateSchedule(schedule: ISchedule): Promise<void> {
    await connectMongoose()
    const { id, ...updateData } = schedule
    await Schedule.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateData }
    )
  }

  async deleteSchedule(id: string): Promise<void> {
    await connectMongoose()
    await Schedule.findByIdAndDelete(id)
  }
}
