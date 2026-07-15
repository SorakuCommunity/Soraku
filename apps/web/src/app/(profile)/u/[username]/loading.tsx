import { PublicProfileSkeleton } from '@/components/profile/public-profile-view'

export default function Loading() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <PublicProfileSkeleton />
    </div>
  )
}
