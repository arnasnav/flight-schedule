import { model, models, Schema, Model, Types } from "mongoose"
import type { IWithStringId } from "./model-t"

export interface IAircraft {
  id?: string
  name: string
  seats: number
}

type IReturnType = IWithStringId<IAircraft>

const AircraftSchema = new Schema<IAircraft>(
  {
    name: { type: String, required: true },
    seats: { type: Number, required: true },
  },
  {
    timestamps: false,
    collection: "aircrafts",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: IAircraft & { _id: Types.ObjectId },
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  },
)

export const Aircraft: Model<IAircraft> =
  models.Aircraft || model("Aircraft", AircraftSchema)
