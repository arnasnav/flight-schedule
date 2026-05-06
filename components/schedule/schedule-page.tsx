"use client"

import { useState } from "react"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { ISchedule } from "@/models/schedule-model"
import { deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AddScheduleDialog } from "./parts/add-schedule-dialog"
import { DeleteScheduleDialog } from "./parts/delete-schedule-dialog"
import { EditScheduleDialog } from "./parts/edit-schedule-dialog"
import { ScheduleList } from "./parts/schedule-list"

type Props = {
  initialSchedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export function Schedule({ initialSchedules, airports, companies }: Props) {
  const [schedules, setSchedules] = useState<ISchedule[]>(initialSchedules)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | null>(null)

  const refreshSchedules = async () => {
    const res = await fetch("/api/schedule")
    const data = await res.json()
    setSchedules(data ?? [])
  }

  const handleAdd = async (formData: any) => {
    const res = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      setIsAddOpen(false)
      refreshSchedules()
    }
  }

  const handleEdit = async (formData: any) => {
    if (!editingSchedule) return

    const res = await fetch(`/api/schedule/${editingSchedule.id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      setEditingSchedule(null)
      refreshSchedules()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    await deleteApi("/api/schedule", deleteId)
    setDeleteId(null)
    refreshSchedules()
  }

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Skrydžių tvarkaraštis
          </h1>
          <p className="text-muted-foreground mt-1">
            Valdykite išvykimus, atvykimus ir skrydžių statusus.
          </p>
        </div>

        <Button onClick={() => setIsAddOpen(true)}>Pridėti skrydį</Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0">
          <ScheduleList
            schedules={schedules}
            airports={airports}
            companies={companies}
            onEdit={setEditingSchedule}
            onDelete={setDeleteId}
          />
        </CardContent>
      </Card>

      <AddScheduleDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onConfirm={handleAdd}
        airports={airports}
        companies={companies}
        existingSchedules={schedules}
      />

      <EditScheduleDialog
        open={!!editingSchedule}
        schedule={editingSchedule}
        onClose={() => setEditingSchedule(null)}
        onConfirm={handleEdit}
        airports={airports}
        companies={companies}
        existingSchedules={schedules}
      />

      <DeleteScheduleDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
