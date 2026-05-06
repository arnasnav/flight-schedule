"use client"

import { ICompany } from "@/models/company-model"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Props = {
  companies: ICompany[]
  onDelete: (id: string) => void
  onEdit: (company: ICompany) => void
}

export function CompanyList({ companies, onDelete, onEdit }: Props) {
  if (companies.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Kraunama arba nėra įrašų
      </div>
    )
  }

  return (
    <ul>
      {companies.map((company, index) => (
        <li key={company.id}>
          <div className="flex items-center justify-between px-4 py-3">
            
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{company.code}</span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {company.id}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(company)}
              >
                Keisti
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(company.id!)}
              >
                Ištrinti
              </Button>
            </div>

          </div>

          {index !== companies.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  )
}