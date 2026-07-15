import { ProductNavbar } from '@/components/layout/product-navbar'
import { MinimalFooter } from '@/components/layout/minimal-footer'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductNavbar />
      <main className="min-h-screen">{children}</main>
      <MinimalFooter />
    </>
  )
}
