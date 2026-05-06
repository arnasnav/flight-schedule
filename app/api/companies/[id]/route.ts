import { CompanyService } from "@/services/company-service"
import { ICompany } from "@/models/company-model"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const companyService = new CompanyService()
  await companyService.deleteCompany(id)

  return Response.json({ message: "Deleted successfully" })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const body = await request.json()

  const companyService = new CompanyService()

  await companyService.updateCompany({
    id: id,
    code: body.name || body.code,
  } as ICompany)

  return Response.json({ message: "Updated successfully" })
}
