import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Image,
  Settings,
  Trophy,
  Banknote,
  LayoutGrid,
  LogOut,
  Moon,
  Sun,
  Handshake,
  UserPlus,
} from 'lucide-react'

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      isActive: pathname === '/',
    },
    {
      name: 'Edit Profile',
      href: '/profile/me',
      icon: UserPlus,
      isActive: pathname.startsWith('/profile/me'),
    },
    {
      name: 'My Gallery',
      href: '/gallery',
      icon: Image,
      isActive: pathname.startsWith('/gallery'),
    },
    {
      name: 'My Events',
      href: '/events',
      icon: Calendar,
      isActive: pathname.startsWith('/events'),
    },
    {
      name: 'Settings',
      href: '/profile/me',
      icon: Settings,
      isActive: pathname.startsWith('/profile/me'),
    },
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 z-[100] flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300'
        )}
      >
        <div className="flex h-16 items-center px-4 border-b border-white/10">
          <Button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5"
          >
            <Moon className="h-4 w-4 text-white/60 hover:text-white" />
          </Button>
          <span className="font-black text-white text-lg">Soraku Profile</span>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                item.isActive
                  ? 'bg-white/10 text-white border-l-4 border-primary'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className={cn(
                item.isActive ? 'h-5 w-5 text-primary' : 'h-5 w-5 text-white/60'
              )} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/5"
            >
              <Sun className="h-4 w-4 text-white/60 hover:text-white" />
            </button>
            <Link
              href="/api/auth/logout"
              className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

// Simple button component for the close icon in header
function Button({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick: () => void }) {
  return (
    <button className={cn('btn-reset', className)} onClick={onClick}>
      {children}
    </button>
  )
}