"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import type { IAirport } from "@/models/airport-model"
import type { IAircraft } from "@/models/aircraft-model"
import type { ICompany } from "@/models/company-model"
import type { ISchedule } from "@/models/schedule-model"
import type { IStatus } from "@/models/status-model"
import type { ITerminal } from "@/models/terminal-model"

import { AddScheduleDialogForm } from "./add-schedule-dialog-form"

type IProps = {
  onClose: () => void
  onConfirm: (data: ISchedule) => Promise<void>
  airports: IAirport[]
  companies: ICompany[]
  existingSchedules: ISchedule[]
  statuses: IStatus[]
  terminals: ITerminal[]
  aircrafts: IAircraft[]
}

export function AddScheduleDialog({
  onClose,
  onConfirm,
  airports,
  companies,
  existingSchedules,
  statuses,
  terminals,
  aircrafts,
}: IProps) {
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
