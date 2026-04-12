'use client'

import { useEffect, useState } from 'react'
import {
  TrendingUp,
  Award,
  Heart,
  FileText,
  Users,
  Activity,
  Clock,
  Eye,
  MessageCircle,
  Calendar,
  Plus,
  Edit3,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStats {
  reputation: number
  badges: number
  supporters: number
  posts: number
}

interface ActivityItem {
  id: string
  type: 'post' | 'like' | 'comment' | 'event_join' | 'follow'
  description: string
  time: string
  avatar?: string
}

interface User {
  id: string
  username: string | null
  displayname: string | null
  avatarurl: string | null
  role: string
  supporterrole?: string | null
}

const MOCK_STATS: DashboardStats = {
  reputation: 1250,
  badges: 8,
  supporters: 42,
  posts: 23,
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'post',
    description: 'Posted a new article "Review: Kimi no Na wa"',
    time: '2 hours ago',
  },
  { id: '2', type: 'like', description: 'Liked a post in VTuber Community', time: '5 hours ago' },
  {
    id: '3',
    type: 'comment',
    description: 'Commented on "Anime Winter 2026 Recommendations"',
    time: '1 day ago',
  },
  {
    id: '4',
    type: 'event_join',
    description: 'Joined event "Nonton Bareng: Demon Slayer"',
    time: '2 days ago',
  },
  { id: '5', type: 'follow', description: 'Started following @kazuma_san', time: '3 days ago' },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS)
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch('/api/auth/me').then((r) => r.json())])
      .then(([userData]) => {
        setUser(userData.data ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const StatCard = ({
    label,
    value,
    icon: Icon,
    trend,
    color = 'primary',
  }: {
    label: string
    value: number | string
    icon: React.ElementType
    trend?: string
    color?: 'primary' | 'accent' | 'secondary'
  }) => {
    const colorClasses = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      accent: 'bg-accent/10 text-accent border-accent/20',
      secondary: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
    }

    return (
      <div className="glass-card flex items-center gap-4 rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1">
        <div className={cn('rounded-xl border p-3', colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className="flex items-center gap-0.5 text-xs text-green-400">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const ActivityItem = ({ item }: { item: ActivityItem }) => {
    const iconMap = {
      post: { icon: FileText, color: 'text-primary bg-primary/10' },
      like: { icon: Heart, color: 'text-pink-400 bg-pink-400/10' },
      comment: { icon: MessageCircle, color: 'text-blue-400 bg-blue-400/10' },
      event_join: { icon: Calendar, color: 'text-green-400 bg-green-400/10' },
      follow: { icon: Users, color: 'text-purple-400 bg-purple-400/10' },
    }
    const { icon: Icon, color } = iconMap[item.type]

    return (
      <div className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
        <div className={cn('rounded-lg p-2', color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground text-sm">{item.description}</p>
          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {item.time}
          </p>
        </div>
      </div>
    )
  }

  const QuickAction = ({
    icon: Icon,
    label,
    href,
    primary = false,
  }: {
    icon: React.ElementType
    label: string
    href: string
    primary?: boolean
  }) => (
    <a
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
        primary
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'text-foreground border border-white/10 bg-white/5 hover:bg-white/10'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  )

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-primary/30 border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{user?.displayname ? `, ${user.displayname}` : ''}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your account.</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Reputation"
          value={stats.reputation.toLocaleString()}
          icon={TrendingUp}
          trend="+12%"
          color="primary"
        />
        <StatCard label="Badges" value={stats.badges} icon={Award} color="accent" />
        <StatCard
          label="Supporters"
          value={stats.supporters}
          icon={Heart}
          trend="+5"
          color="secondary"
        />
        <StatCard label="Posts" value={stats.posts} icon={FileText} color="primary" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <QuickAction icon={Plus} label="New Post" href="/posts/new" primary />
        <QuickAction icon={Edit3} label="Edit Profile" href="/profile/me" />
        <QuickAction icon={Bell} label="Notifications" href="/notifications" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Activity className="text-primary h-5 w-5" />
              Activity Feed
            </h2>
            <a href="/activity" className="text-primary text-sm hover:underline">
              View all
            </a>
          </div>
          <div className="space-y-1">
            {activities.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Premium Promo */}
          <div className="glass-card from-primary/10 to-accent/5 border-primary/20 rounded-2xl bg-gradient-to-br p-5">
            <div className="mb-3 flex items-center gap-2">
              <Award className="text-primary h-5 w-5" />
              <h3 className="font-bold">Go Premium</h3>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Unlock exclusive features and support the community.
            </p>
            <a
              href="/premium"
              className="bg-primary text-primary-foreground hover:bg-primary/90 block w-full rounded-xl py-2.5 text-center font-medium transition-colors"
            >
              Upgrade Now
            </a>
          </div>

          {/* Upcoming Events */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold">
                <Calendar className="text-primary h-5 w-5" />
                Upcoming Events
              </h3>
              <a href="/events" className="text-primary text-sm hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Nonton Bareng: Demon Slayer', date: 'Tomorrow, 19:00' },
                { title: 'Community Gathering', date: 'Sat, 14:00' },
              ].map((event, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
