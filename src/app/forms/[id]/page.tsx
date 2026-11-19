import { notFound } from "next/navigation"

import { FormSubmission } from "@/components/form-submission"
import type { FormDefinition } from "@/lib/schemas"

export const revalidate = 60

async function getFormFromApi(id: string): Promise<FormDefinition | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://127.0.0.1:3000")

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = apiUrl
    ? `${baseUrl.replace(/\/$/, "")}/forms/${encodeURIComponent(id)}`
    : `${baseUrl.replace(/\/$/, "")}/api/forms/${encodeURIComponent(id)}`

  const response = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!response.ok) return null
  return response.json()
}

export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const definition = await getFormFromApi(id)

  if (!definition) notFound()

  return (
    <main className="flex min-h-full justify-center px-4 py-12">
      <FormSubmission definition={definition} />
    </main>
  )
}
