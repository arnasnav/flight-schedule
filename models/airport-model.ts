import { model, models, Schema, Model, Types } from "mongoose"
import { WithStringId } from "./model-t"

export interface IAirport {
  id?: string
  name: string
}

type IReturnType = WithStringId<IAirport>

const AirportSchema = new Schema<IAirport>(
  { name: String },
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
