"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type IProps = {
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAirportDialog({ onClose, onConfirm }: IProps) {
  const handleConfirm = () => {
    onConfirm()

    toast.success("Oro uostas sėkmingai ištrintas")

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trinti oro uostą?</DialogTitle>

          <DialogDescription>
            Ar tikrai norite tęsti?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Atšaukti
          </Button>

          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Ištrinti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}