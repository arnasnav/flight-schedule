"use client"

import { useState } from "react"
import type { ISchedule } from "@/models/schedule-model"
import { getApi, postApi, putApi, deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AddScheduleDialog } from "./parts/add-schedule-dialog"
import { DeleteScheduleDialog } from "./parts/delete-schedule-dialog"
import { EditScheduleDialog } from "./parts/edit-schedule-dialog"
import { ScheduleList } from "./parts/schedule-list"
import type { IScheduleProps } from "@/types/props/schedule"

export function Schedule(props: IScheduleProps) {
  const {
    initialSchedules,
    airports,
    companies,
    statuses,
    terminals,
    aircrafts,
  } = props

  const [schedules, setSchedules] = useState<ISchedule[]>(initialSchedules)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined)
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | undefined>(
    undefined
  )

  const refreshSchedules = async () => {
    const data = await getApi<ISchedule[]>("/api/schedules")
    setSchedules(data ?? [])
  }

  const handleAdd = async (formData: ISchedule) => {
    await postApi("/api/schedules", formData)
    setIsAddOpen(false)
    await refreshSchedules()
  }

  const handleEdit = async (formData: ISchedule) => {
    if (!editingSchedule) return
    formData.id = editingSchedule.id
    await putApi(`/api/schedules/${editingSchedule.id}`, formData)
    setEditingSchedule(undefined)
    await refreshSchedules()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteApi("/api/schedules", deleteId)
    setDeleteId(undefined)
    await refreshSchedules()
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

      {isAddOpen && (
        <AddScheduleDialog
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAdd}
          airports={airports}
          companies={companies}
          statuses={statuses}
          terminals={terminals}
          aircrafts={aircrafts}
          existingSchedules={schedules}
        />
      )}

      {editingSchedule && (
        <EditScheduleDialog
          key={editingSchedule.id}
          schedule={editingSchedule}
          onClose={() => setEditingSchedule(undefined)}
          onConfirm={handleEdit}
          airports={airports}
          companies={companies}
          statuses={statuses}
          terminals={terminals}
          aircrafts={aircrafts}
          existingSchedules={schedules}
        />
      )}

      {deleteId && (
        <DeleteScheduleDialog
          onClose={() => setDeleteId(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
