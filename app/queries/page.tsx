import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const queryPages = [
  { title: "Atskrendantys lektuvai", slug: "/queries/arriving-aircrafts" },
  { title: "Isskrendantys lektuvai", slug: "/queries/departing-aircrafts" },
  { title: "Tranzito oro uostai", slug: "/queries/transit-airports" },
  { title: "Skrydziai is oro uosto", slug: "/queries/flights-from-airport" },
  { title: "Skrydziai pagal kompanija", slug: "/queries/flights-by-company" },
]

export default function Page() {
  return (
    <div className="p-8 w-full max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Uzklausos
        </h1>
        <p className="text-muted-foreground mt-1">
          Pasirinkite uzklausos tipa is saraso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queryPages.map((queryPage) => (
          <Link key={queryPage.slug} href={queryPage.slug}>
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>{queryPage.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Atidaryti uzklausos puslapi
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
