"use client"

import { useState } from "react"
import type { ICompany } from "@/models/company-model"
import { getApi, postApi, putApi, deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { CompanyList } from "./parts/company-list"
import { DeleteCompanyDialog } from "./parts/delete-company-dialog"
import { EditCompanyDialog } from "./parts/edit-company-dialog"
import { AddCompanyDialog } from "./parts/add-company-dialog"
import { Button } from "@/components/ui/button"

type IProps = {
  companies: ICompany[]
}

export function Companies(props: IProps) {
  const [companies, setCompanies] = useState<ICompany[]>(props.companies)
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined)
  const [editingCompany, setEditingCompany] = useState<ICompany | undefined>(
    undefined
  )
  const [isAddOpen, setIsAddOpen] = useState(false)

  const companyNames = companies.map((c) => c.name)

  const refreshCompanies = async () => {
    const data = await getApi<ICompany[]>("/api/companies")
    setCompanies(data ?? [])
  }

  const handleAdd = async (name: string, code: string) => {
    await postApi("/api/companies", { name, code })
    setIsAddOpen(false)
    await refreshCompanies()
  }

  const handleEdit = async (newName: string, newCode: string) => {
    if (!editingCompany) return

    await putApi("/api/companies", {
      id: editingCompany.id,
      name: newName,
      code: newCode,
    })

    setEditingCompany(undefined)
    await refreshCompanies()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await deleteApi("/api/companies", deleteId)
    setDeleteId(undefined)
    await refreshCompanies()
  }

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Kompanijų valdymas
          </h1>
          <p className="text-muted-foreground mt-1">
            Pridėkite, redaguokite arba šalinkite kompanijas.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>Pridėti kompaniją</Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <CompanyList
            companies={companies}
            onDelete={(id) => setDeleteId(id)}
            onEdit={(c) => setEditingCompany(c)}
          />
        </CardContent>
      </Card>

      {isAddOpen && (
        <AddCompanyDialog
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAdd}
          existingNames={companyNames}
        />
      )}

      {editingCompany && (
        <EditCompanyDialog
          company={editingCompany}
          onClose={() => setEditingCompany(undefined)}
          onConfirm={handleEdit}
          existingNames={companyNames}
        />
      )}

      {deleteId && (
        <DeleteCompanyDialog
          onClose={() => setDeleteId(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
