import { Company } from "@/models/company-model"
import type { ICompany } from "@/models/company-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import type { IWithStringId } from "@/models/model-t"
import { CompanyService } from "@/services/company-service"

export async function GET(): Promise<NextResponse<IWithStringId<ICompany>[]>> {
  await connectMongoose()
  const companies = await Company.find()
  return NextResponse.json(companies)
}

export async function POST(request: Request) {
  await connectMongoose()
  const body = await request.json()

  const newCompany = await Company.create(body)

  return Response.json(newCompany)
}

export async function PUT(request: Request) {
  const body = await request.json()

  const companyService = new CompanyService()

  await companyService.updateCompany(body)

  return Response.json({ message: "Updated successfully" })
}