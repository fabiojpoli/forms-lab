import { describe, expect, it } from "vitest"

import { buildZodSchema, formSchema } from "@/lib/schemas"

describe("buildZodSchema", () => {
  it("validates required, string, email, and number fields", () => {
    const schema = buildZodSchema(formSchema)

    const result = schema.safeParse({
      fullName: "A",
      email: "not-an-email",
      age: 12,
      department: "engineering",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining([
          "Full Name must be at least 2 characters",
          "Enter a valid email address",
          "Must be at least 18",
        ]),
      )
    }
  })

  it("accepts valid data and optional empty fields", () => {
    const schema = buildZodSchema(formSchema)

    expect(
      schema.parse({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        age: 36,
        bio: "",
        department: "engineering",
      }),
    ).toMatchObject({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      age: 36,
    })
  })
})
