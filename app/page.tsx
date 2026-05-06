import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Lėktuvų tvarkaraščio sistema
        </h1>

        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Valdykite skrydžius, oro uostus ir aviacijos kompanijas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <Link href="/schedule">
            <Button className="w-40">Tvarkaraštis</Button>
          </Link>

          <Link href="/airports">
            <Button className="w-40">Oro uostai</Button>
          </Link>

          <Link href="/companies">
            <Button className="w-40">Kompanijos</Button>
          </Link>
        </div>
      </div>

      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Tvarkaraštis</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Peržiūrėkite visus skrydžius ir jų laikus.
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Oro uostai</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Valdykite oro uostų sąrašą ir informaciją.
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Kompanijos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Valdykite kompanijų sąrašą ir informaciją.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
