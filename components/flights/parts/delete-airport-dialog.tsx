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

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteAirportDialog({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trinti oro uostą?</DialogTitle>
          <DialogDescription>Ar tikrai norite tęsti?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              toast.success("Oro uostas sėkmingai ištrintas")
              onClose()
            }}
          >
            Ištrinti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
