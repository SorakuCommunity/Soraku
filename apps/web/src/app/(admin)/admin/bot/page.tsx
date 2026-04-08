'use client'

import { useEffect, useState } from 'react'
import {
  Bot,
  Activity,
  Users,
  MessageSquare,
  Settings,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Shield,
  Music,
  Calendar,
  Terminal,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BotStatus {
  online: boolean
  uptime: number
  servers: number
  users: number
  commands_used: number
  latency: number
}

interface BotSettings {
  prefix: string
  music_enabled: boolean
  moderation_enabled: boolean
  auto_replies_enabled: boolean
  level_system_enabled: boolean
}

const STATS = [
  { key: 'servers', label: 'Server', icon: Users },
  { key: 'users', label: 'Total Users', icon: Users },
  { key: 'commands_used', label: 'Commands Used', icon: Terminal },
  { key: 'latency', label: 'Latency', icon: Activity, format: (v: number) => `${v}ms` },
]

const MODULES = [
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    enabled: true,
    description: 'Play music from various sources',
  },
  {
    id: 'moderation',
    name: 'Moderation',
    icon: Shield,
    enabled: true,
    description: 'Auto-moderation and mod tools',
  },
  {
    id: 'auto_replies',
    name: 'Auto Replies',
    icon: MessageSquare,
    enabled: true,
    description: 'Custom auto-response triggers',
  },
  {
    id: 'level_system',
    name: 'Level System',
    icon: Zap,
    enabled: false,
    description: 'XP and level tracking',
  },
]

export default function BotPage() {
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [settings, setSettings] = useState<BotSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/admin/bot/status').then((r) => r.json()),
      fetch('/api/admin/bot/settings').then((r) => r.json()),
    ])
      .then(([statusData, settingsData]) => {
        setStatus(statusData.data ?? null)
        setSettings(settingsData.data ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSettingToggle = async (key: keyof BotSettings) => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/bot/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: !settings[key as keyof BotSettings] }),
      })
      if (res.ok) {
        setSettings((s) => (s ? { ...s, [key]: !s[key as keyof BotSettings] } : null))
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary/40 mb-1 text-[9px] font-black tracking-[0.25em] uppercase">
            Discord Bot
          </p>
          <h1 className="text-2xl font-black tracking-tight">Kontrol Bot</h1>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-muted-foreground/50 hover:text-foreground hover:bg-muted/20 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs transition-all disabled:opacity-30"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Separator */}
      <div className="from-primary/20 via-border/25 -mt-4 h-px bg-gradient-to-r to-transparent" />

      {/* Status Banner */}
      <div
        className={cn(
          'flex items-center justify-between rounded-2xl border p-6',
          status?.online
            ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
            : 'border-red-500/20 bg-red-500/[0.02]'
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl',
              status?.online ? 'bg-emerald-500/10' : 'bg-red-500/10'
            )}
          >
            {status?.online ? (
              <Bot className="h-6 w-6 text-emerald-400" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-400" />
            )}
          </div>
          <div>
            <p className="text-foreground text-lg font-bold">
              {status?.online ? 'Bot Online' : 'Bot Offline'}
            </p>
            <p className="text-muted-foreground/40 text-sm">
              Uptime: {status ? formatUptime(status.uptime) : '-'}
            </p>
          </div>
        </div>
        {status?.online ? (
          <CheckCircle className="h-6 w-6 text-emerald-400" />
        ) : (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" /> Check logs
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <Icon className="h-4 w-4 text-[#4FA3D1]" />
            </div>
            <div
              className={cn(
                'text-2xl font-black',
                loading ? 'text-muted-foreground/20 animate-pulse' : 'text-foreground'
              )}
            >
              {loading
                ? '—'
                : format
                  ? format((status as any)?.[key] ?? 0)
                  : ((status as any)?.[key] ?? 0).toLocaleString('id-ID')}
            </div>
            <p className="text-muted-foreground/40 mt-1 text-[11px] font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Modules
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {MODULES.map((module) => (
            <div
              key={module.id}
              className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.02]">
                  <module.icon className="h-5 w-5 text-[#6E8FA6]" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-bold">{module.name}</p>
                  <p className="text-muted-foreground/40 text-xs">{module.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingToggle(`${module.id}_enabled` as keyof BotSettings)}
                disabled={saving}
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  (settings as any)?.[`${module.id}_enabled`] ? 'bg-[#4FA3D1]' : 'bg-white/[0.08]'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
                    (settings as any)?.[`${module.id}_enabled`] ? 'left-6' : 'left-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-muted-foreground/30 mb-4 text-[9px] font-black tracking-[0.25em] uppercase">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="text-foreground flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/[0.04]">
            <RefreshCw className="h-4 w-4" /> Restart
          </button>
          <button className="text-foreground flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/[0.04]">
            <Activity className="h-4 w-4" /> View Logs
          </button>
          <button className="text-foreground flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/[0.04]">
            <Users className="h-4 w-4" /> Manage Servers
          </button>
        </div>
      </div>
    </div>
  )
}
