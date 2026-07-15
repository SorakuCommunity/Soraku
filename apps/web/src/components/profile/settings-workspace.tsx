'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { SettingsSidebar } from '@/components/profile/settings-sidebar'
import { MinimalFooter } from '@/components/layout/minimal-footer'
import { ProductNavbar } from '@/components/layout/product-navbar'

export function SettingsWorkspace({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex-col">
      <ProductNavbar showSidebarTrigger />

      {/* Sidebar + content */}
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-1">
        <SettingsSidebar />
        <SidebarInset>
          <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          <MinimalFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
