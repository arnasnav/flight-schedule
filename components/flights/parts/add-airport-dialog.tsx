"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  existingNames: string[]
}

export function AddAirportDialog({
  open,
  onClose,
  onConfirm,
  existingNames = [],
}: Props) {
  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(5, "Pavadinimas turi būti bent 5 simbolių ilgio.")
      .max(50, "Pavadinimas per ilgas.")
      .refine(
        (val) =>
          !existingNames.some(
            (name) => name.toLowerCase() === val.trim().toLowerCase()
          ),
        { message: "Oro uostas tokiu pavadinimu jau egzistuoja." }
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    onConfirm(data.name)
    toast.success(`Oro uostas sėkmingai pridėtas`)
    form.reset()
    onClose()
  }

  React.useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pridėti oro uostą</DialogTitle>
          <DialogDescription>Įveskite oro uosto pavadinimą.</DialogDescription>
        </DialogHeader>

        <form id="add-airport-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="airport-name">Pavadinimas</FieldLabel>
                  <Input
                    {...field}
                    id="airport-name"
                    placeholder="Vilniaus oro uostas"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Atšaukti
          </Button>
          <Button type="submit" form="add-airport-form">
            Pridėti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
