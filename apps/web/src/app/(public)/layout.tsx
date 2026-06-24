import Navbar from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 pb-16 lg:pb-0">{children}</main>
      <Footer />
    </>
  )
}
