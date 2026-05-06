import { Company, ICompany } from "@/models/company-model"
import { connectMongoose } from "@/utils/mongoose-client"
import { NextResponse } from "next/server"
import { WithStringId } from "@/models/model-t"

export async function GET(): Promise<NextResponse<WithStringId<ICompany>[]>> {
  await connectMongoose()
  const companies = await Company.find()
  return NextResponse.json(companies)
}

export async function POST(request: Request) {
  await connectMongoose()
  const body = await request.json()

  const newCompany = new Company({
    code: body.code || body.name,
  })

  await newCompany.save()
  return Response.json(newCompany, { status: 201 })
}
