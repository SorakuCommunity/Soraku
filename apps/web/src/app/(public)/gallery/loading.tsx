export default function GalleryLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="bg-border/50 h-12 w-48 rounded-xl" />
      </div>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card bg-border/20 mb-4 h-48 break-inside-avoid" />
        ))}
      </div>
    </div>
  )
}
