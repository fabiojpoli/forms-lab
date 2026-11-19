import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "node:crypto"

import {
  buildZodSchema,
  formSchema,
  type FormDefinition,
} from "../../../src/lib/schemas"

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}))
const tableName = process.env.SUBMISSIONS_TABLE

const supportRequest: FormDefinition = {
  title: "Support Request",
  description: "Tell us how we can help.",
  fields: [
    { name: "subject", type: "text", label: "Subject", required: true, min: 3, max: 100 },
    { name: "email", type: "email", label: "Email", required: true },
    { name: "message", type: "textarea", label: "Request details", required: true, min: 10, max: 1000 },
  ],
}

const forms: Record<string, FormDefinition> = {
  "user-profile": formSchema,
  "support-request": supportRequest,
}

function formId(params: Record<string, string | undefined> | undefined) {
  return params?.id
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  }
}

function response(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(body),
  }
}

export async function getForm(event: {
  pathParameters?: Record<string, string | undefined>
}) {
  const id = formId(event.pathParameters)
  const definition = id ? forms[id] : undefined

  if (!definition) {
    return response(404, { error: "Form not found" })
  }

  return response(200, definition)
}

export async function submitForm(event: {
  pathParameters?: Record<string, string | undefined>
  body?: string | null
}) {
  const id = formId(event.pathParameters)
  const definition = id ? forms[id] : undefined

  if (!definition) {
    return response(404, { error: "Form not found" })
  }

  let values: unknown
  try {
    values = JSON.parse(event.body ?? "{}")
  } catch {
    return response(400, { error: "Invalid JSON body" })
  }

  const parsed = buildZodSchema(definition).safeParse(values)
  if (!parsed.success) {
    return response(400, {
      error: "Validation failed",
      issues: parsed.error.issues,
    })
  }

  if (!tableName) {
    return response(500, { error: "Submissions table is not configured" })
  }

  const submissionId = randomUUID()
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: id,
        SK: submissionId,
        formId: id,
        submissionId,
        submittedAt: new Date().toISOString(),
        values: parsed.data,
      },
    }),
  )

  return response(201, { submissionId })
}
