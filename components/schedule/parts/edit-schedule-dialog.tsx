"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { EditScheduleDialogForm } from "./edit-schedule-dialog-form"
import type { IEditScheduleDialogProps } from "@/types/props/schedule"

export function EditScheduleDialog(props: IEditScheduleDialogProps) {
  const {
    schedule,
    onClose,
    onConfirm,
    airports,
    companies,
    existingSchedules,
    statuses,
    terminals,
    aircrafts,
  } = props

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <EditScheduleDialogForm
          schedule={schedule}
          onClose={onClose}
          onConfirm={onConfirm}
          airports={airports}
          companies={companies}
          existingSchedules={existingSchedules}
          statuses={statuses}
          terminals={terminals}
          aircrafts={aircrafts}
        />
      </DialogContent>
    </Dialog>
  )
}
