import { Company, ICompany } from "@/models/company-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { Types } from "mongoose"

export class CompanyService {
  async getCompanies(): Promise<ICompany[]> {
    await connectMongoose()
    const companies = await Company.find().sort({ name: 1 })
    return companies
  }

  async saveCompany(company: ICompany): Promise<void> {
    await connectMongoose()
    await Company.create(company)
  }

  async createCompany(data: Partial<ICompany>): Promise<void> {
    await connectMongoose()
    const newCompany = new Company(data)
    await newCompany.save()
  }

  async updateCompany(company: ICompany): Promise<void> {
    await connectMongoose()
    const { id, ...updateData } = company
    await Company.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: updateData }
    )
  }

  async deleteCompany(id: string): Promise<void> {
    await connectMongoose()
    await Company.findByIdAndDelete(id)
  }
}
