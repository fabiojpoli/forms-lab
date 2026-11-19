import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formDefinitions } from "@/lib/form-data"

export default function HomePage() {
  return (
    <main className="mx-auto min-h-full max-w-5xl px-4 py-12">
      <nav className="mb-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-medium">
          <Image src="/globe.svg" alt="" width={28} height={28} />
          Metadata Forms
        </Link>
        <div className="flex gap-5 text-sm">
          <Link href="/designer" className="hover:underline">Designer</Link>
          <Link href="/submissions" className="hover:underline">Submissions</Link>
        </div>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Forms</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a form to view and submit it.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {formDefinitions.map((definition) => {
          const id = definition.title.toLowerCase().replaceAll(" ", "-")
          return (
            <Link key={id} href={`/forms/${id}`}>
              <Card className="h-full transition-colors hover:border-foreground/20">
                <CardHeader>
                  <CardTitle>{definition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{definition.description}</p>
                  <p className="mt-3 text-sm">{definition.fields.length} fields</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
