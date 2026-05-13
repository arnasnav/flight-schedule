import type { IAirport } from "@/models/airport-model"

export type IAirportsProps = {
  airports: IAirport[]
}

export type IAirportListProps = {
  airports: IAirport[]
  onDelete: (id: string) => void
  onEdit: (airport: IAirport) => void
}

export type IAddAirportDialogProps = {
  onClose: () => void
  onConfirm: (name: string, code: string) => void
  existingNames: string[]
}

export type IEditAirportDialogProps = {
  airport: IAirport
  onClose: () => void
  onConfirm: (newName: string, newCode: string) => void
  existingNames: string[]
}
