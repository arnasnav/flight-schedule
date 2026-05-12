import { Company } from "@/models/company-model"
import type { ICompany } from "@/models/company-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import type { IWithStringId } from "@/models/model-t"

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