import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { DynamicForm } from "@/components/dynamic-form"
import type { FormDefinition } from "@/lib/schemas"

describe("DynamicForm", () => {
  it("shows validation messages after invalid submission", async () => {
    const definition: FormDefinition = {
      title: "Test Form",
      description: "",
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
          label: "Email",
          required: true,
        },
      ],
    }

    const user = userEvent.setup()
    render(<DynamicForm definition={definition} />)

    await user.type(screen.getByLabelText("Full Name *"), "A")
    await user.type(screen.getByLabelText("Email *"), "invalid")
    await user.click(screen.getByRole("button", { name: "Submit" }))
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }).closest("form")!)

    await waitFor(() => {
      expect(
        screen.queryByText("Full Name must be at least 2 characters") ??
          screen.queryByText("Full Name is required"),
      ).toBeTruthy()
      expect(
        screen.queryByText("Enter a valid email address") ??
          screen.queryByText("Email Address is required"),
      ).toBeTruthy()
    })
  })
})
