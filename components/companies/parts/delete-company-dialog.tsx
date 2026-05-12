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

export function DeleteCompanyDialog(props: IProps) {
  const { onClose, onConfirm } = props
  const handleConfirm = () => {
    onConfirm()
    toast.success("Kompanija sėkmingai ištrinta")
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trinti kompaniją?</DialogTitle>

          <DialogDescription>Ar tikrai norite tęsti?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>

          <Button variant="destructive" onClick={handleConfirm}>
            Ištrinti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
