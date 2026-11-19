export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="animate-pulse rounded-lg border">
        <div className="h-12 border-b bg-muted/50" />
        {[1, 2, 3].map((row) => (
          <div key={row} className="h-12 border-b last:border-0" />
        ))}
      </div>
    </main>
  )
}
