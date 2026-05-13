import type { ICompany } from "@/models/company-model"

export type ICompaniesProps = {
  companies: ICompany[]
}

export type ICompanyListProps = {
  companies: ICompany[]
  onDelete: (id: string) => void
  onEdit: (company: ICompany) => void
}

export type IAddCompanyDialogProps = {
  onClose: () => void
  onConfirm: (name: string, code: string) => void
  existingNames: string[]
}

export type IEditCompanyDialogProps = {
  company: ICompany
  onClose: () => void
  onConfirm: (newName: string, newCode: string) => void
  existingNames: string[]
}
