'use client'
import { useState } from 'react'
import { Edit2, Check, X, ExternalLink, Calendar, Twitter, Github, Youtube, Instagram } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Profile {
  id: string
  username: string
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  role: string | null
  created_at: string
  socials: Record<string, string> | null
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  twitter:   <Twitter size={14} />,
  github:    <Github size={14} />,
  youtube:   <Youtube size={14} />,
  instagram: <Instagram size={14} />,
}

export function ProfileClient({ profile, isOwner }: { profile: Profile; isOwner: boolean }) {
  const [editing, setEditing] = useState(false)
  const [bio, setBio]         = useState(profile.bio ?? '')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const saveProfile = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('users')
      .update({ bio })
      .eq('id', profile.id)
    setLoading(false)
    if (error) { toast.error('Gagal menyimpan profil'); return }
    toast.success('Profil diperbarui')
    setEditing(false)
  }

  const socials = profile.socials ?? {}

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Cover */}
      <div className="relative h-48 sm:h-64 overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-dark-base) 100%)',
            opacity: 0.4,
          }} />
        )}
      </div>

      {/* Profile info */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative -mt-16 mb-4 flex items-end justify-between">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 overflow-hidden"
            style={{ borderColor: 'var(--bg-card)', backgroundColor: 'var(--bg-muted)' }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                {profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Edit button */}
          {isOwner && !editing && (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium min-h-[44px] transition-all hover:bg-[var(--hover-bg)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
              <Edit2 size={14} /> Edit Profil
            </button>
          )}
          {editing && (
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={loading}
                className="p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center transition-all"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                <Check size={16} />
              </button>
              <button onClick={() => setEditing(false)}
                className="p-2.5 rounded-xl border min-h-[44px] min-w-[44px] flex items-center justify-center"
                style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Name + role */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {profile.username}
            </h1>
            {profile.role && (
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ backgroundColor: 'var(--badge-bg)', color: 'var(--badge-text)' }}>
                {profile.role}
              </span>
            )}
          </div>

          {/* Joined date */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-sub)' }}>
            <Calendar size={12} />
            Bergabung {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          {editing ? (
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300}
              placeholder="Tulis bio singkat kamu..."
              className="w-full p-3 rounded-xl border text-sm resize-none outline-none focus:ring-2"
              rows={3}
              style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          ) : (
            bio ? (
              <p className="text-sm" style={{ color: 'var(--text-sub)' }}>{bio}</p>
            ) : (
              isOwner && <p className="text-sm italic" style={{ color: 'var(--text-sub)' }}>Belum ada bio.</p>
            )
          )}
        </div>

        {/* Social links */}
        {Object.keys(socials).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(socials).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:bg-[var(--hover-bg)] min-h-[36px]"
                style={{ borderColor: 'var(--border)', color: 'var(--text-sub)' }}>
                {SOCIAL_ICONS[platform] ?? <ExternalLink size={12} />}
                {platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
