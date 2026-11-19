import { NextResponse } from "next/server"

import { getFormDefinition } from "@/lib/form-data"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const definition = getFormDefinition(id)

  if (!definition) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  return NextResponse.json(definition)
}
