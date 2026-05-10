import { model, models, Schema, Model, Types } from "mongoose"
import { WithStringId } from "./model-t"

export interface ISchedule {
  id?: string
  flightId: string
  airportId: string
  departureAirportCode: string
  departureAirportName: string
  companyId: string
  airlineCode: string
  airlineName: string
  flightNumber: string
  departureTime: string
  scheduledDepartureTime: string
  actualDepartureTime: string
  arrivalAirportId: string
  arrivalTime: string
  arrivalAirportCode: string
  arrivalAirportName: string
  scheduledArrivalTime: string
  actualArrivalTime: string
  flightStatus: string
  terminal: string
  gate: string
  aircraftType: string
  seatCount: number
  availableSeatCount: number
  flightPrice: number
  baggageLimit: string
  stopoverAirports: { code: string; name: string }[]
  hasArrived: boolean
}

type IReturnType = WithStringId<ISchedule>

const ScheduleSchema = new Schema<ISchedule>(
  {
    flightId: { type: String, required: true, unique: true },
    airportId: { type: String, required: true },
    departureAirportCode: { type: String, required: true },
    departureAirportName: { type: String, required: true },
    companyId: { type: String, required: true },
    airlineCode: { type: String, required: true },
    airlineName: { type: String, required: true },
    flightNumber: { type: String, required: true, unique: true },
    departureTime: { type: String, required: true },
    scheduledDepartureTime: { type: String, required: true },
    actualDepartureTime: { type: String, required: true },
    arrivalAirportId: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    arrivalAirportCode: { type: String, required: true },
    arrivalAirportName: { type: String, required: true },
    scheduledArrivalTime: { type: String, required: true },
    actualArrivalTime: { type: String, required: true },
    flightStatus: { type: String, required: true },
    terminal: { type: String, required: true },
    gate: { type: String, required: true },
    aircraftType: { type: String, required: true },
    seatCount: { type: Number, required: true },
    availableSeatCount: { type: Number, required: true },
    flightPrice: { type: Number, required: true },
    baggageLimit: { type: String, required: true },
    stopoverAirports: {
      type: [{ code: { type: String, required: true }, name: { type: String, required: true } }],
      default: [],
    },
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