import { CompanyService } from "@/services/company-service"

export async function PUT(request: Request) {
  const body = await request.json()

  const companyService = new CompanyService()
  await companyService.updateCompany(body)

  return Response.json({ message: "Updated successfully" })
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/companies/[id]">,
) {
  const { id } = await ctx.params

  const companyService = new CompanyService()
  await companyService.deleteCompany(id)

  return Response.json({ message: "Deleted successfully" })
}
