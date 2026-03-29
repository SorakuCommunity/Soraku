export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="bg-border/50 h-12 w-56 rounded-xl" />
        <div className="bg-border/30 mt-4 h-4 w-80 rounded" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="bg-border/20 h-40" />
            <div className="space-y-3 p-5">
              <div className="bg-border/30 h-4 w-full rounded" />
              <div className="bg-border/20 h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
