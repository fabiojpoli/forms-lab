"use client"

import dynamic from "next/dynamic"

const DesignerWorkspace = dynamic(
  () => import("@/components/designer-workspace"),
  {
    loading: () => (
      <main className="min-h-full px-4 py-8">
        <div
          className="mx-auto h-96 max-w-6xl animate-pulse rounded-xl bg-muted"
          aria-label="Loading form designer"
        />
      </main>
    ),
  },
)

export default function DesignerPage() {
  return <DesignerWorkspace />
}
