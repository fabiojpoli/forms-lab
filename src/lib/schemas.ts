import { z, type ZodType } from "zod"

export type FormFieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "textarea"

export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  name: string
  type: FormFieldType
  label: string
  required: boolean
  min?: number
  max?: number
  options?: FormFieldOption[]
}

export interface FormDefinition {
  title: string
  description: string
  fields: FormField[]
}

export const formSchema: FormDefinition = {
  title: "User Profile",
  description: "Enter your profile information.",
  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      required: true,
      min: 2,
      max: 80,
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      required: true,
      min: 18,
      max: 120,
    },
    {
      name: "bio",
      type: "textarea",
      label: "Biography",
      required: false,
      min: 10,
      max: 500,
    },
    {
      name: "department",
      type: "select",
      label: "Department",
      required: true,
      options: [
        { label: "Engineering", value: "engineering" },
        { label: "Design", value: "design" },
        { label: "Operations", value: "operations" },
      ],
    },
  ],
}

export function buildZodSchema(definition: FormDefinition) {
  const shape: Record<string, ZodType> = {}

  for (const field of definition.fields) {
    let fieldSchema

    switch (field.type) {
      case "email":
        fieldSchema = z
          .string()
          .min(1, "Email Address is required")
          .email("Enter a valid email address")
        break
      case "number":
        fieldSchema = z.number("Enter a valid number")
        if (field.min !== undefined) {
          fieldSchema = fieldSchema.min(
            field.min,
            `Must be at least ${field.min}`,
          )
        }
        if (field.max !== undefined) {
          fieldSchema = fieldSchema.max(
            field.max,
            `Must be at most ${field.max}`,
          )
        }
        break
      case "select":
        fieldSchema = z.string().min(1, `${field.label} is required`)
        break
      case "text":
      case "textarea":
        fieldSchema = z.string(
          field.required ? `${field.label} is required` : undefined,
        )
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`)
        }
        if (field.min !== undefined) {
          fieldSchema = fieldSchema.min(
            field.min,
            `${field.label} must be at least ${field.min} characters`,
          )
        }
        if (field.max !== undefined) {
          fieldSchema = fieldSchema.max(
            field.max,
            `${field.label} must be at most ${field.max} characters`,
          )
        }
        break
    }

    shape[field.name] = field.required
      ? fieldSchema
      : z.union([fieldSchema, z.literal("")]).optional()
  }

  return z.object(shape)
}
