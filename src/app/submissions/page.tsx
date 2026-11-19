import { Suspense } from "react"
import { localSubmissions } from "@/lib/submission-store"

export const dynamic = "force-dynamic"

async function getSubmissions() {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return localSubmissions
}

async function SubmissionsTable() {
  const submissions = await getSubmissions()

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3">Submission</th>
            <th className="px-4 py-3">Form</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b last:border-0">
              <td className="px-4 py-3 font-medium">{submission.id}</td>
              <td className="px-4 py-3">{submission.form}</td>
              <td className="px-4 py-3">{submission.submittedAt}</td>
              <td className="px-4 py-3">{submission.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SubmissionsLoading() {
  return (
    <div className="animate-pulse rounded-lg border">
      <div className="h-10 border-b bg-muted/50" />
      {[1, 2, 3].map((row) => (
        <div key={row} className="h-12 border-b last:border-0 px-4">
          <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function SubmissionsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold">Submissions</h1>
      <Suspense fallback={<SubmissionsLoading />}>
        <SubmissionsTable />
      </Suspense>
    </main>
  )
}
