import { model, models, Schema, Model, Types } from "mongoose"
import type { IWithStringId } from "./model-t"

export interface IAirport {
  id?: string
  name: string
  code: string
}

type IReturnType = IWithStringId<IAirport>

const AirportSchema = new Schema<IAirport>(
  {
    name: String,
    code: String,
  },
  {
    timestamps: false,
    collection: "airports",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: IAirport & { _id: Types.ObjectId }
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  }
)

export const Airport: Model<IAirport> =
  models.Airport || model("Airport", AirportSchema)
