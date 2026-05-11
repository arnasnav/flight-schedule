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
import type { ICompany } from "@/models/company-model"
import { toast } from "sonner"

type IProps = {
  company: ICompany
  onClose: () => void
  onConfirm: (newName: string, newCode: string) => void
  existingNames: string[]
}

export function EditCompanyDialog(props: IProps) {
  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, "Pavadinimas turi būti bent 3 simbolių ilgio.")
      .max(25, "Pavadinimas per ilgas.")
      .refine(
        (val) => {
          if (val.toLowerCase() === props.company.name.toLowerCase()) {
            return true
          }

          return !props.existingNames.some(
            (name) => name.toLowerCase() === val.toLowerCase()
          )
        },
        { message: "Kompanija tokiu pavadinimu jau egzistuoja." }
      ),
    code: z
      .string()
      .trim()
      .min(2, "Kodas per trumpas.")
      .max(2, "Kodas per ilgas."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  })

  React.useEffect(() => {
    form.reset(props.company)
  }, [props.company, form])

  function onSubmit(data: z.infer<typeof formSchema>) {
    props.onConfirm(data.name, data.code)
    toast.success("Kompanija sėkmingai redaguota")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
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
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="company-name">Pavadinimas</FieldLabel>

                  <Input
                    {...field}
                    id="company-name"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="company-code">Kodas</FieldLabel>

                  <Input
                    {...field}
                    id="company-code"
                    placeholder="FR"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
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
          <Button variant="outline" onClick={props.onClose} type="button">
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
