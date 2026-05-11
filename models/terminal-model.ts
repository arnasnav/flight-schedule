import { model, models, Schema, Model, Types } from "mongoose"
import type { IWithStringId } from "./model-t"

export interface ITerminal {
  id?: string
  name: string
  gates: string[]
}

type IReturnType = IWithStringId<ITerminal>

const TerminalSchema = new Schema<ITerminal>(
  {
    name: { type: String, required: true },
    gates: { type: [String], default: [] },
  },
  {
    timestamps: false,
    collection: "terminals",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: ITerminal & { _id: Types.ObjectId },
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  },
)

export const Terminal: Model<ITerminal> =
  models.Terminal || model("Terminal", TerminalSchema)
