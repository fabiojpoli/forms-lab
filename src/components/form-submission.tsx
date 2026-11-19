"use client"

import { useState } from "react"

import { DynamicForm } from "@/components/dynamic-form"
import type { FormDefinition } from "@/lib/schemas"

export function FormSubmission({ definition }: { definition: FormDefinition }) {
  const [message, setMessage] = useState("")

  async function submit(values: Record<string, unknown>) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      setMessage("Submission received.")
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: definition.title,
          values,
        }),
      }).catch(() => undefined)
      return
    }

    const formId = definition.title.toLowerCase().replaceAll(" ", "-")
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/forms/${encodeURIComponent(formId)}/submissions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    )

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      setMessage(body?.error ?? "Submission failed.")
      return
    }

    setMessage("Submission received.")
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <DynamicForm definition={definition} onSubmit={submit} />
      {message ? (
        <p className="rounded-lg border px-4 py-3 text-sm" role="status">
          {message}
        </p>
      ) : null}
    </div>
  )
}
