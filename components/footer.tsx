import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="mt-10 border-t bg-background">
      <div className="container mx-auto flex flex-col items-center gap-4 py-6 text-sm">
        <div className="text-center">&copy; Copyright</div>

        <Separator />
      </div>
    </footer>
  )
}
