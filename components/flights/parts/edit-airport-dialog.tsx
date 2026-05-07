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
import { IAirport } from "@/models/airport-model"
import { toast } from "sonner"

type IProps = {
  airport: IAirport
  onClose: () => void
  onConfirm: (newName: string) => void
  existingNames: string[]
}

export function EditAirportDialog(props: IProps) {
  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(5, "Pavadinimas turi būti bent 5 simbolių ilgio.")
      .max(50, "Pavadinimas per ilgas.")
      .refine(
        (val) => {
          if (val.toLowerCase() === props.airport.name.toLowerCase()) {
            return true
          }

          return !props.existingNames.some(
            (name) => name.toLowerCase() === val.toLowerCase()
          )
        },
        { message: "Oro uostas tokiu pavadinimu jau egzistuoja." }
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  React.useEffect(() => {
    form.reset(props.airport)
  }, [props.airport, form])

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    props.onConfirm(data.name)
    toast.success("Oro uostas sėkmingai redaguotas")
    form.reset()
    props.onClose()
  }

  return (
    <Dialog open={true} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redaguoti oro uostą</DialogTitle>

          <DialogDescription>
            Įveskite naują oro uosto pavadinimą.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-airport-form" onSubmit={form.handleSubmit(handleSubmit)}>
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
          <Button variant="outline" onClick={props.onClose} type="button">
            Atšaukti
          </Button>

          <Button type="submit" form="edit-airport-form">
            Išsaugoti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
