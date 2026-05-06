"use client"

import { useState } from "react"
import { IAirport } from "@/models/airport-model"
import { deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AirportList } from "./parts/airport-list"
import { DeleteAirportDialog } from "./parts/delete-airport-dialog"
import { EditAirportDialog } from "./parts/edit-airport-dialog"
import { AddAirportDialog } from "./parts/add-airport-dialog"

type Props = {
  airport: IAirport[]
}

export function Airports({ airport }: Props) {
  const [airports, setAirports] = useState(airport)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingAirport, setEditingAirport] = useState<IAirport | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleAdd = async (name: string) => {
    await fetch("/api/airports", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    })
    setIsAddOpen(false)
    refreshAirports()
  }

  const handleEdit = async (newName: string) => {
    if (!editingAirport) return
    await fetch(`/api/airports/${editingAirport.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: newName }),
      headers: { "Content-Type": "application/json" },
    })
    setEditingAirport(null)
    refreshAirports()
  }

  const refreshAirports = async () => {
    const res = await fetch("/api/airports")
    const data = await res.json()
    setAirports(data ?? [])
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await deleteApi("/api/airports", deleteId)
    setDeleteId(null)
    refreshAirports()
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

      <AddAirportDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAdd}
        existingNames={airports.map((a) => a.name)}
      />

      <EditAirportDialog
        open={!!editingAirport}
        airport={editingAirport}
        onClose={() => setEditingAirport(null)}
        onConfirm={handleEdit}
        existingNames={airports.map((a) => a.name)}
      />

      <DeleteAirportDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
