import { model, models, Schema, Model, Types } from "mongoose"
import { WithStringId } from "./model-t"

export interface ISchedule {
  id?: string
  airportId: string
  companyId: string
  flightNumber: string
  departureTime: string
  arrivalAirportId: string
  arrivalTime: string
  hasArrived: boolean
}

type IReturnType = WithStringId<ISchedule>

const ScheduleSchema = new Schema<ISchedule>(
  {
    airportId: { type: String, required: true },
    companyId: { type: String, required: true },
    flightNumber: { type: String, required: true, unique: true },
    departureTime: { type: String, required: true },
    arrivalAirportId: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    hasArrived: { type: Boolean, default: false },
  },
  {
    timestamps: false,
    collection: "schedule",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: ISchedule & { _id: Types.ObjectId }
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  }
)

export const Schedule: Model<ISchedule> =
  models.Schedule || model("Schedule", ScheduleSchema)