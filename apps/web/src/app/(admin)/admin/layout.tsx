'use client'

import { AppSidebar } from '@/components/admin/app-sidebar'
import { AppHeader } from '@/components/admin/app-header'
import { SidebarProvider } from '@/components/admin/sidebar-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex w-full flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-8">
              <div className="mx-auto max-w-6xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
