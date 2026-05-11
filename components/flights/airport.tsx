"use client"

import { useState } from "react"
import type { IAirport } from "@/models/airport-model"
import { getApi, postApi, putApi, deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AirportList } from "./parts/airport-list"
import { DeleteAirportDialog } from "./parts/delete-airport-dialog"
import { EditAirportDialog } from "./parts/edit-airport-dialog"
import { AddAirportDialog } from "./parts/add-airport-dialog"

type IProps = {
  airports: IAirport[]
}

export function Airports({ airports: initialAirports }: IProps) {
  const [airports, setAirports] = useState<IAirport[]>(initialAirports)
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined)
  const [editingAirport, setEditingAirport] = useState<IAirport | undefined>(
    undefined
  )
  const [isAddOpen, setIsAddOpen] = useState(false)

  const airportNames = airports.map((a) => a.name)

  const refreshAirports = async () => {
    const data = await getApi<IAirport[]>("/api/airports")
    setAirports(data ?? [])
  }

  const handleAdd = async (name: string, code: string) => {
    await postApi("/api/airports", { name, code })
    setIsAddOpen(false)
    await refreshAirports()
  }

  const handleEdit = async (newName: string, newCode: string) => {
    if (!editingAirport) return

    await putApi("/api/airports", {
      id: editingAirport.id,
      name: newName,
      code: newCode,
    })

    setEditingAirport(undefined)
    await refreshAirports()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await deleteApi("/api/airports", deleteId)
    setDeleteId(undefined)
    await refreshAirports()
  }

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Oro uostų valdymas
          </h1>
          <p className="text-muted-foreground mt-1">
            Pridėkite, redaguokite arba šalinkite oro uostus.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>Pridėti oro uostą</Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <AirportList
            airports={airports}
            onDelete={(id) => setDeleteId(id)}
            onEdit={(a) => setEditingAirport(a)}
          />
        </CardContent>
      </Card>

      {isAddOpen && (
        <AddAirportDialog
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAdd}
          existingNames={airportNames}
        />
      )}

      {editingAirport && (
        <EditAirportDialog
          key={editingAirport.id}
          airport={editingAirport}
          onClose={() => setEditingAirport(undefined)}
          onConfirm={handleEdit}
          existingNames={airportNames}
        />
      )}

      {deleteId && (
        <DeleteAirportDialog
          onClose={() => setDeleteId(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
