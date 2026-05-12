import { CompanyService } from "@/services/company-service"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const companyService = new CompanyService()
  await companyService.updateCompany({ ...body, id })

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const companyService = new CompanyService()
  await companyService.deleteCompany(id)

  return Response.json({ message: "Deleted successfully" })
}