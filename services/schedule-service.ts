import { Schedule, ISchedule } from "@/models/schedule-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { Types } from "mongoose"

export class ScheduleService {
  async getSchedules(): Promise<ISchedule[]> {
    await connectMongoose()
    const schedules = await Schedule.find().sort({ departureTime: 1 })
    return schedules
  }

  async saveSchedule(schedule: ISchedule): Promise<void> {
    await connectMongoose()
    await Schedule.create(schedule)
  }

  async createSchedule(data: Partial<ISchedule>): Promise<void> {
    await connectMongoose()
    const newSchedule = new Schedule(data)
    await newSchedule.save()
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
