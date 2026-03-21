export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="bg-primary/10 mb-4 h-4 w-24 rounded-full" />
        <div className="bg-border/50 h-12 w-64 rounded-xl" />
        <div className="bg-border/30 mt-4 h-4 w-80 rounded" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-border/30 h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="glass-card mb-8 grid h-48 lg:h-64 lg:grid-cols-2" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="bg-border/20 h-36" />
            <div className="space-y-3 p-5">
              <div className="bg-border/30 h-3 w-full rounded" />
              <div className="bg-border/20 h-3 w-3/4 rounded" />
              <div className="bg-border/15 h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
