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
import { ICompany } from "@/models/company-model"
import { toast } from "sonner"

type Props = {
  company: ICompany | null
  open: boolean
  onClose: () => void
  onConfirm: (newName: string) => void
  existingNames: string[]
}

export function EditCompanyDialog({
  company,
  open,
  onClose,
  onConfirm,
  existingNames,
}: Props) {
  const formSchema = z.object({
    code: z
      .string()
      .trim()
      .min(3, "Pavadinimas turi būti bent 3 simbolių ilgio.")
      .max(25, "Pavadinimas per ilgas.")
      .refine(
        (val) => {
          if (company && val.toLowerCase() === company.code.toLowerCase()) {
            return true
          }
          return !existingNames.some(
            (name) => name.toLowerCase() === val.toLowerCase()
          )
        },
        { message: "Kompanija tokiu pavadinimu jau egzistuoja." }
      ),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  React.useEffect(() => {
    if (company) {
      form.reset({ code: company.code })
    }
  }, [company, form])

  React.useEffect(() => {
    if (!open) form.reset()
  }, [open, form])

  function onSubmit(data: z.infer<typeof formSchema>) {
    onConfirm(data.code)
    toast.success(`Kompanija sėkmingai redaguota`)
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redaguoti kompaniją</DialogTitle>
          <DialogDescription>
            Įveskite naują kompanijos pavadinimą.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-company-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
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
          <Button type="submit" form="edit-company-form">
            Išsaugoti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
