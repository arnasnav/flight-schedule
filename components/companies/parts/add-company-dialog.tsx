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
  onConfirm: (code: string) => void
  existingNames: string[]
}

export function AddCompanyDialog({
  open,
  onClose,
  onConfirm,
  existingNames = [],
}: Props) {
  const formSchema = z.object({
    code: z
      .string()
      .trim()
      .min(3, "Pavadinimas turi būti bent 3 simbolių ilgio.")
      .max(25, "Pavadinimas per ilgas.")
      .refine(
        (val) =>
          !existingNames.some(
            (code) => code.toLowerCase() === val.trim().toLowerCase()
          ),
        { message: "Kompanija tokiu pavadinimu jau egzistuoja." }
      ),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    onConfirm(data.code)
    toast.success(`Kompanija sėkmingai pridėta`)
    form.reset()
    onClose()
  }

  React.useEffect(() => {
    if (!open) form.reset()
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pridėti naują kompaniją</DialogTitle>
          <DialogDescription>Įveskite kompanijos pavadinimą.</DialogDescription>
        </DialogHeader>

        <form id="add-company-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="company-code">Pavadinimas</FieldLabel>
                  <Input
                    {...field}
                    id="company-code"
                    placeholder="Ryanair"
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
          <Button type="submit" form="add-company-form">
            Pridėti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
