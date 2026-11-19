import { formSchema, type FormDefinition } from "@/lib/schemas"

export const formDefinitions: FormDefinition[] = [
  formSchema,
  {
    title: "Support Request",
    description: "Tell us how we can help.",
    fields: [
      {
        name: "subject",
        type: "text",
        label: "Subject",
        required: true,
        min: 3,
        max: 100,
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        required: true,
      },
      {
        name: "message",
        type: "textarea",
        label: "Request details",
        required: true,
        min: 10,
        max: 1000,
      },
    ],
  },
]

export function getFormDefinition(id: string) {
  return formDefinitions.find((definition) =>
    definition.title.toLowerCase().replaceAll(" ", "-") === id
  )
}
