export interface StoredSubmission {
  id: string
  form: string
  submittedAt: string
  status: string
  values: Record<string, unknown>
}

export const localSubmissions: StoredSubmission[] = [
  {
    id: "SUB-1042",
    form: "User Profile",
    submittedAt: "2026-11-19 08:42",
    status: "Received",
    values: {},
  },
  {
    id: "SUB-1041",
    form: "Support Request",
    submittedAt: "2026-11-19 08:31",
    status: "In review",
    values: {},
  },
]
