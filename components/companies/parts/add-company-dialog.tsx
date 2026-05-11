"use client"

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

type IProps = {
  onClose: () => void
  onConfirm: (name: string, code: string) => void
  existingNames: string[]
}

export function AddCompanyDialog(props: IProps) {
  const { onClose, onConfirm, existingNames } = props

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, "Pavadinimas turi būti bent 3 simbolių ilgio.")
      .max(25, "Pavadinimas per ilgas.")
      .refine(
        (val) =>
          !existingNames.some(
            (name) => name.toLowerCase() === val.toLowerCase()
          ),
        {
          message: "Kompanija tokiu pavadinimu jau egzistuoja.",
        }
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    onConfirm(data.name, data.code)
    toast.success("Kompanija sėkmingai pridėta")
    form.reset()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pridėti naują kompaniją</DialogTitle>

          <DialogDescription>Įveskite kompanijos pavadinimą.</DialogDescription>
        </DialogHeader>

        <form id="add-company-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Controller
              name="name"
              control={form.control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="company-name">Pavadinimas</FieldLabel>

                  <Input
                    {...field}
                    id="company-name"
                    placeholder="Ryanair"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
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
