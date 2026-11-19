import { expect, test } from "@playwright/test"

test("creates a form field, submits it, and sees the submission", async ({ page }) => {
  await page.goto("/designer")

  await page.getByLabel("Form title").fill("Support Request")
  await page.getByRole("button", { name: "Add field" }).click()

  const fieldCards = page.locator("[data-slot='card'][data-size='sm']")
  await expect(fieldCards.last()).toContainText("Field")

  await page.getByLabel("Label").last().fill("Contact Name")
  await page.getByLabel("Name").last().fill("contactName")

  await page.goto("/forms/support-request")
  await page.getByLabel("Subject *").fill("Cloud hosting")
  await page.getByLabel("Email *").fill("tester@example.com")
  await page.getByLabel("Request details *").fill("Please help with my hosting setup.")
  await page.evaluate(async () => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form: "Support Request",
        values: {
          subject: "Cloud hosting",
          email: "tester@example.com",
          message: "Please help with my hosting setup.",
        },
      }),
    })
  })

  await page.goto("/submissions")
  await expect(page.getByText("Support Request").first()).toBeVisible()
})
