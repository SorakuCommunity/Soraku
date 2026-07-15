'use client'

import * as React from 'react'
import Link from 'next/link'
import { BellIcon } from '@radix-ui/react-icons'
import { useNotifications } from '@/hooks/use-notifications'
import { NOTIF_CONFIG } from '@/lib/notifications'
import { formatRelativeTime } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function NavbarNotifications() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unreadCount > 0 ? (
            <button
              onClick={() => markAllRead()}
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Mark all read
            </button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          ) : (
            notifications.map((n) => {
              const cfg = NOTIF_CONFIG[n.type] ?? NOTIF_CONFIG.info
              return (
                <Link
                  key={n.id}
                  href={n.href ?? '#'}
                  onClick={() => {
                    if (!n.isread) markRead([n.id])
                    setOpen(false)
                  }}
                  className="flex gap-3 border-b border-border/60 px-4 py-3 transition-colors last:border-0 hover:bg-muted/50"
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-base ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${n.isread ? 'text-muted-foreground' : 'text-foreground'}`}
                    >
                      {n.title}
                    </p>
                    {n.body ? (
                      <p className="truncate text-xs text-muted-foreground/70">{n.body}</p>
                    ) : null}
                    <p className="mt-0.5 text-[11px] text-muted-foreground/50">
                      {formatRelativeTime(n.createdat)}
                    </p>
                  </div>
                  {!n.isread ? (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  ) : null}
                </Link>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
