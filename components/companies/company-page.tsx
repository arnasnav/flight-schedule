"use client"

import { useState } from "react"
import { ICompany } from "@/models/company-model"
import { deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { CompanyList } from "./parts/company-list"
import { DeleteCompanyDialog } from "./parts/delete-company-dialog"
import { EditCompanyDialog } from "./parts/edit-company-dialog"
import { AddCompanyDialog } from "./parts/add-company-dialog"
import { Button } from "@/components/ui/button"

type Props = {
  company: ICompany[]
}

export function Companies({ company }: Props) {
  const [companies, setCompanies] = useState(company)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingCompany, setEditingCompany] = useState<ICompany | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleAdd = async (name: string) => {
    await fetch("/api/companies", {
      method: "POST",
      body: JSON.stringify({ code: name }),
      headers: { "Content-Type": "application/json" },
    })
    setIsAddOpen(false)
    refreshCompanies()
  }

  const handleEdit = async (newName: string) => {
    if (!editingCompany) return
    await fetch(`/api/companies/${editingCompany.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName }),
      headers: { "Content-Type": "application/json" },
    })
    setEditingCompany(null)
    refreshCompanies()
  }

  const refreshCompanies = async () => {
    const res = await fetch("/api/companies")
    const data = await res.json()
    setCompanies(data ?? [])
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await deleteApi("/api/companies", deleteId)
    setDeleteId(null)
    refreshCompanies()
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
        <Button onClick={() => setIsAddOpen(true)}>
          Pridėti kompaniją
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <CompanyList
            companies={companies}
            onDelete={(id) => setDeleteId(id)}
            onEdit={(a) => setEditingCompany(a)}
          />
        </CardContent>
      </Card>

      <AddCompanyDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAdd}
        existingNames={companies.map((c) => c.code)}
      />

      <EditCompanyDialog
        open={!!editingCompany}
        company={editingCompany}
        onClose={() => setEditingCompany(null)}
        onConfirm={handleEdit}
        existingNames={companies.map((c) => c.code)}
      />

      <DeleteCompanyDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
