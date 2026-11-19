import { NextResponse } from "next/server"

import { formDefinitions } from "@/lib/form-data"

export function GET() {
  const forms = formDefinitions.map((definition) => ({
    id: definition.title.toLowerCase().replaceAll(" ", "-"),
    title: definition.title,
    description: definition.description,
  }))

  return NextResponse.json(forms)
}
