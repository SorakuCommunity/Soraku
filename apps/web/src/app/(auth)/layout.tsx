import Navbar from '@/components/layout/navbar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14">{children}</main>
    </>
  )
}
