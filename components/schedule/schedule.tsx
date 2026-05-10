"use client"

import { useState } from "react"
import { IAirport } from "@/models/airport-model"
import { ICompany } from "@/models/company-model"
import { ISchedule } from "@/models/schedule-model"
import { getApi, postApi, putApi, deleteApi } from "@/utils/server-api"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { AddScheduleDialog } from "./parts/add-schedule-dialog"
import { DeleteScheduleDialog } from "./parts/delete-schedule-dialog"
import { EditScheduleDialog } from "./parts/edit-schedule-dialog"
import { ScheduleList } from "./parts/schedule-list"
import { toast } from "sonner"

type IProps = {
  initialSchedules: ISchedule[]
  airports: IAirport[]
  companies: ICompany[]
}

export function Schedule(props: IProps) {
  const [schedules, setSchedules] = useState<ISchedule[]>(
    props.initialSchedules
  )

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined)
  const [editingSchedule, setEditingSchedule] = useState<ISchedule | undefined>(
    undefined
  )

  const refreshSchedules = async () => {
    const data = await getApi<ISchedule[]>("/api/schedule")
    setSchedules(data ?? [])
  }

  const handleAdd = async (formData: any) => {
    try {
      const res = await postApi("/api/schedule", formData)
      if (!res) return
      setIsAddOpen(false)
      await refreshSchedules()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepavyko pridėti skrydžio"
      toast.error(message)
    }
  }

  const handleEdit = async (formData: any) => {
    if (!editingSchedule) return

    try {
      await putApi(`/api/schedule/${editingSchedule.id}`, formData)
      setEditingSchedule(undefined)
      await refreshSchedules()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepavyko atnaujinti skrydžio"
      toast.error(message)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteApi("/api/schedule", deleteId)
      setDeleteId(undefined)
      await refreshSchedules()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nepavyko ištrinti skrydžio"
      toast.error(message)
    }
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
            airports={props.airports}
            companies={props.companies}
            onEdit={setEditingSchedule}
            onDelete={setDeleteId}
          />
        </CardContent>
      </Card>

      {isAddOpen && (
        <AddScheduleDialog
          onClose={() => setIsAddOpen(false)}
          onConfirm={handleAdd}
          airports={props.airports}
          companies={props.companies}
          existingSchedules={schedules}
        />
      )}

      {editingSchedule && (
        <EditScheduleDialog
          schedule={editingSchedule}
          onClose={() => setEditingSchedule(undefined)}
          onConfirm={handleEdit}
          airports={props.airports}
          companies={props.companies}
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
