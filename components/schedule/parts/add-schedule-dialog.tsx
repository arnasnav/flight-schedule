"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

import { AddScheduleDialogForm } from "./add-schedule-dialog-form"
import type { IAddScheduleDialogProps } from "@/types/props/schedule"

export function AddScheduleDialog(props: IAddScheduleDialogProps) {
  const {
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
        <AddScheduleDialogForm
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
