import { model, models, Schema, Model, Types } from "mongoose"
import { WithStringId } from "./model-t"

export interface ICompany {
  id?: string
  code: string
}

type IReturnType = WithStringId<ICompany>

const CompanySchema = new Schema<ICompany>(
  { code: String },
  {
    timestamps: false,
    collection: "companies",
    strict: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (
        _doc: unknown,
        ret: ICompany & { _id: Types.ObjectId }
      ): IReturnType => {
        const { _id, ...rest } = ret
        return { ...rest, id: _id.toString() }
      },
    },
  }
)

export const Company: Model<ICompany> =
  models.Company || model("Company", CompanySchema)
