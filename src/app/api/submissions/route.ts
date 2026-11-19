import { NextResponse } from "next/server"

import { localSubmissions } from "@/lib/submission-store"

export function GET() {
  return NextResponse.json(localSubmissions)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
  }

  const submissionId = `SUB-${Date.now().toString().slice(-6)}`
  localSubmissions.unshift({
    id: submissionId,
    form: String(body.form ?? "Custom Form"),
    submittedAt: new Date().toISOString(),
    status: "Received",
    values: body.values && typeof body.values === "object" ? body.values : {},
  })

  return NextResponse.json({ submissionId }, { status: 201 })
}
