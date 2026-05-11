import { model, models, Schema, Model, Types } from "mongoose"
import type { IWithStringId } from "./model-t"

export interface IStatus {
  id?: string
  name: string
}

type IReturnType = IWithStringId<IStatus>

const StatusSchema = new Schema<IStatus>(
  { name: String },
  {
    timestamps: false,
    collection: "statuses",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: IStatus & { _id: Types.ObjectId }
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  }
)

export const Status: Model<IStatus> =
  models.Status || model("Status", StatusSchema)
