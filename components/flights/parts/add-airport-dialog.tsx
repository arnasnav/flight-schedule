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

export function AddAirportDialog({
  onClose,
  onConfirm,
  existingNames,
}: IProps) {
  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(5, "Pavadinimas turi būti bent 5 simbolių ilgio.")
      .max(50, "Pavadinimas per ilgas.")
      .refine(
        (val) =>
          !existingNames.some(
            (name) => name.toLowerCase() === val.toLowerCase()
          ),
        {
          message: "Oro uostas tokiu pavadinimu jau egzistuoja.",
        }
      ),
    code: z
      .string()
      .trim()
      .min(2, "Kodas per trumpas.")
      .max(5, "Kodas per ilgas."),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onConfirm(data.name, data.code)
    toast.success("Oro uostas sėkmingai pridėtas")
    form.reset()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pridėti oro uostą</DialogTitle>

          <DialogDescription>Įveskite oro uosto pavadinimą.</DialogDescription>
        </DialogHeader>

        <form id="add-airport-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <FieldLabel htmlFor="airport-code">Kodas</FieldLabel>

                  <Input
                    {...field}
                    id="airport-code"
                    placeholder="VNO"
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

          <Button type="submit" form="add-airport-form">
            Pridėti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
