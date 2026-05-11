import { Status } from "@/models/status-model"
import type { IStatus } from "@/models/status-model"
import { connectMongoose } from "@/utils/mongoose-client"

export class CompanyService {
  async getCompanies(): Promise<IStatus[]> {
    await connectMongoose()
    const companies = await Status.find().sort({ name: 1 })
    return companies
  }
}
