'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Send,
  ChevronDown,
  ChevronUp,
  BookOpen,
  // Twitter, // moved to custom-icons
  // Facebook,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { XIcon, FacebookIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'

// ─── Types ─────────────────────────────────────────────────────────────────
interface Author {
  username: string | null
  displayname: string | null
  avatarurl: string | null
}
interface Comment {
  id: string
  parentid: string | null
  userid: string | null
  guestname: string | null
  content: string
  createdat: string
  author: Author | null
  replies: Comment[]
}
interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverurl: string | null
  tags: string[]
  publishedat: string
}
interface Props {
  slug: string
  content: string
  likecount: number
  siteUrl: string
  title: string
  tags: string[]
  related: RelatedPost[]
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl backdrop-blur-sm',
        type === 'success'
          ? 'border-green-500/30 bg-green-500/15 text-green-400'
          : 'border-red-500/30 bg-red-500/15 text-red-400'
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Comment Item ─────────────────────────────────────────────────────────
function CommentItem({
  comment,
  slug,
  isLoggedIn,
  onReplyPosted,
  onToast,
  depth = 0,
}: {
  comment: Comment
  slug: string
  isLoggedIn: boolean
  depth?: number
  onReplyPosted: (c: Comment, parentId: string) => void
  onToast: (msg: string, type: 'success' | 'error') => void
}) {
  const [showReply, setShowReply] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const name =
    comment.author?.displayname ?? comment.author?.username ?? comment.guestname ?? 'Anonim'
  const initial = name.charAt(0).toUpperCase()

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    if (diff < 60) return 'baru saja'
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
    return `${Math.floor(diff / 86400)} hari lalu`
  }

  const submitReply = async () => {
    if (!replyText.trim() || !isLoggedIn) return
    setSending(true)
    try {
      const res = await fetch(`/api/blog/${slug}/comments/${comment.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText.trim() }),
      })
      let data: any = {}
      try {
        data = await res.json()
      } catch {}
      if (res.ok && data?.data?.id) {
        onReplyPosted(data.data, comment.id)
        setReplyText('')
        setShowReply(false)
        onToast('Balasan terkirim!', 'success')
      } else {
        onToast(data?.error?.message ?? 'Gagal mengirim balasan.', 'error')
      }
    } catch {
      onToast('Koneksi gagal.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={cn('flex gap-3', depth > 0 && 'mt-3 ml-8')}>
      <div className="flex-shrink-0">
        {comment.author?.avatarurl ? (
          <Image
            src={comment.author.avatarurl}
            alt={name}
            width={32}
            height={32}
            className="rounded-xl"
            unoptimized
          />
        ) : (
          <div className="bg-primary/15 text-primary flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black">
            {initial}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="bg-card/50 border-border/30 rounded-2xl border px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-foreground/80 text-xs font-bold">{name}</span>
            <span className="text-muted-foreground/40 text-[10px]">
              {timeAgo(comment.createdat)}
            </span>
          </div>
          <MarkdownRenderer content={comment.content} compact />
        </div>
        {depth === 0 && (
          <div className="mt-1.5 flex items-center gap-3 px-1">
            {isLoggedIn ? (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-muted-foreground/50 hover:text-primary flex items-center gap-1.5 text-[11px] transition-colors"
              >
                <MessageCircle className="h-3 w-3" /> Balas
              </button>
            ) : (
              <Link
                href="/login"
                className="text-muted-foreground/40 hover:text-primary flex items-center gap-1.5 text-[11px] transition-colors"
              >
                <Lock className="h-3 w-3" /> Login untuk balas
              </Link>
            )}
            {comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-muted-foreground/40 hover:text-foreground flex items-center gap-1.5 text-[11px] transition-colors"
              >
                {showReplies ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                {comment.replies.length} balasan
              </button>
            )}
          </div>
        )}
        {showReply && isLoggedIn && (
          <div className="mt-2 flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              placeholder="Tulis balasan..."
              className="border-border/50 bg-card/30 focus:border-primary/40 flex-1 resize-none rounded-xl border px-3 py-2 text-sm transition-all outline-none"
            />
            <button
              onClick={submitReply}
              disabled={sending || !replyText.trim()}
              className="bg-primary/80 hover:bg-primary flex items-center justify-center rounded-xl px-3 text-white transition-colors disabled:opacity-40"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                slug={slug}
                isLoggedIn={isLoggedIn}
                onReplyPosted={onReplyPosted}
                onToast={onToast}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Share Modal ──────────────────────────────────────────────────────────
function ShareModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent
  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="border-border/60 bg-card w-full max-w-sm space-y-4 rounded-2xl border p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-black">Bagikan Artikel</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Twitter/X',
              icon: <XIcon className="h-5 w-5 text-[#1DA1F2]" />,
              href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
            },
            {
              label: 'Facebook',
              icon: <FacebookIcon className="h-5 w-5 text-[#1877F2]" />,
              href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
            },
            {
              label: 'WhatsApp',
              icon: (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              href: `https://wa.me/?text=${enc(title + ' ' + url)}`,
            },
          ].map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border/40 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all"
            >
              {icon}
              <span className="text-muted-foreground/60 text-[10px]">{label}</span>
            </a>
          ))}
        </div>
        <button
          onClick={copy}
          className="border-border/50 bg-muted/20 hover:border-primary/40 flex w-full items-center justify-between rounded-xl border px-4 py-2.5 transition-all"
        >
          <span className="text-muted-foreground/60 truncate font-mono text-xs">{url}</span>
          <div className="ml-2 flex-shrink-0">
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="text-muted-foreground/40 h-4 w-4" />
            )}
          </div>
        </button>
        <button
          onClick={onClose}
          className="border-border/40 text-muted-foreground/50 hover:text-foreground w-full rounded-xl border py-2 text-xs transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function BlogDetailClient({
  slug,
  content,
  likecount,
  siteUrl,
  title,
  tags,
  related,
}: Props) {
  const [likes, setLikes] = useState(likecount)
  const [liked, setLiked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commLoading, setCommLoading] = useState(true)
  const [commOpen, setCommOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const viewCounted = useRef(false)
  const postUrl = `${siteUrl}/blog/${slug}`

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => setToast({ message, type }),
    []
  )

  // Check login status
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.id) setIsLoggedIn(true)
      })
      .catch(() => {})
  }, [])

  // Increment view once
  useEffect(() => {
    if (viewCounted.current) return
    viewCounted.current = true
    fetch(`/api/blog/${slug}/views`, { method: 'POST' }).catch(() => {})
  }, [slug])

  // Load like status — only if logged in (to persist per user)
  useEffect(() => {
    fetch(`/api/blog/${slug}/like`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          setLikes(d.data.likecount ?? likecount)
          setLiked(d.data.reaction === 'like')
        }
      })
      .catch(() => {})
  }, [slug, likecount])

  // Load comments
  useEffect(() => {
    setCommLoading(true)
    fetch(`/api/blog/${slug}/comments`)
      .then((r) => r.json())
      .then((d) => {
        const list = d?.data?.comments
        if (Array.isArray(list)) setComments(list)
      })
      .catch(() => {})
      .finally(() => setCommLoading(false))
  }, [slug])

  const toggleLike = async () => {
    if (!isLoggedIn) {
      showToast('Login dulu untuk memberikan like!', 'error')
      return
    }
    const prevLiked = liked
    setLiked(!prevLiked)
    setLikes((l) => (prevLiked ? Math.max(0, l - 1) : l + 1))
    try {
      const res = await fetch(`/api/blog/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like' }),
      })
      const d = await res.json()
      if (d.data) {
        setLikes(d.data.likecount)
        setLiked(d.data.reaction === 'like')
      }
    } catch {
      setLiked(prevLiked)
      setLikes((l) => (prevLiked ? l + 1 : Math.max(0, l - 1)))
    }
  }

  const submitComment = async () => {
    if (!newComment.trim()) return
    if (!isLoggedIn) {
      showToast('Harus login untuk berkomentar!', 'error')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      })
      let data: any = {}
      try {
        data = await res.json()
      } catch {}
      if (res.ok && data?.data?.id) {
        setComments((prev) => [data.data, ...prev])
        setNewComment('')
        showToast('Komentar berhasil dikirim!', 'success')
      } else {
        showToast(data?.error?.message ?? 'Gagal mengirim komentar.', 'error')
      }
    } catch {
      showToast('Koneksi gagal.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplyPosted = useCallback((reply: Comment, parentId: string) => {
    if (!reply?.id) return
    setComments((prev) =>
      prev.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c))
    )
  }, [])

  const totalComments = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)

  return (
    <>
      <div className="mt-6">
        <MarkdownRenderer content={content} />
      </div>

      {/* Tags after article */}
      {tags.length > 0 && (
        <div className="border-border/30 mt-8 flex flex-wrap gap-1.5 border-t pt-5">
          {tags.map((t: string) => (
            <Link
              key={t}
              href={`/blog?tag=${t}`}
              className="border-border/50 bg-muted/20 text-muted-foreground/60 hover:border-primary/40 hover:text-primary rounded-full border px-3 py-1 text-xs capitalize transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="border-border/40 bg-card/30 mt-6 flex items-center gap-2 rounded-2xl border px-4 py-3">
        <button
          onClick={toggleLike}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all',
            liked
              ? 'border border-red-500/30 bg-red-500/15 text-red-400'
              : 'border-border/50 text-muted-foreground border hover:border-red-400/30 hover:text-red-400'
          )}
        >
          <Heart className={cn('h-4 w-4', liked && 'scale-110 fill-current')} />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => setCommOpen((o) => !o)}
          className="border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{totalComments}</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={() => setShowShare(true)}
            className="border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
          >
            <Share2 className="h-4 w-4" /> Bagikan
          </button>
        </div>
      </div>

      {/* Comments — collapsible */}
      <div className="mt-8 space-y-4">
        <button
          onClick={() => setCommOpen((o) => !o)}
          className="border-border/40 bg-card/30 hover:border-primary/30 flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 transition-all"
        >
          <h3 className="flex items-center gap-2 text-base font-black">
            <MessageCircle className="text-primary h-5 w-5" />
            Komentar
            {totalComments > 0 && (
              <span className="bg-primary/15 text-primary rounded-full px-2.5 py-0.5 text-sm">
                {totalComments}
              </span>
            )}
          </h3>
          <ChevronDown
            className={cn(
              'text-muted-foreground/50 h-4 w-4 transition-transform duration-200',
              commOpen && 'rotate-180'
            )}
          />
        </button>

        {commOpen && (
          <div className="space-y-4">
            {/* Form — require login */}
            {isLoggedIn ? (
              <div className="glass-card space-y-3 rounded-2xl p-4">
                <div className="border-border/40 bg-muted/10 flex w-fit gap-1 rounded-xl border p-1">
                  {(['Tulis', 'Preview'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPreview(tab === 'Preview')}
                      className={cn(
                        'rounded-lg px-3 py-1 text-xs font-semibold transition-all',
                        preview === (tab === 'Preview')
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {preview ? (
                  <div className="border-border/40 min-h-[80px] rounded-xl border bg-black/10 px-4 py-3">
                    {newComment.trim() ? (
                      <MarkdownRenderer content={newComment} compact />
                    ) : (
                      <p className="text-muted-foreground/30 text-xs italic">Belum ada teks...</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    placeholder="Tulis komentar... Mendukung **bold**, *italic*, `code`"
                    className="border-border/50 placeholder:text-foreground/15 focus:border-primary/40 w-full resize-none rounded-xl border bg-black/20 px-3 py-2.5 font-mono text-sm transition-all outline-none"
                  />
                )}
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground/30 text-[10px]">
                    Mendukung **bold**, *italic*, `code`
                  </p>
                  <button
                    onClick={submitComment}
                    disabled={submitting || !newComment.trim()}
                    className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-40"
                  >
                    {submitting ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Kirim
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card space-y-3 rounded-2xl p-5 text-center">
                <Lock className="text-muted-foreground/30 mx-auto h-8 w-8" />
                <p className="text-muted-foreground/60 text-sm">Login untuk berkomentar</p>
                <Link
                  href="/login"
                  className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors"
                >
                  Login / Daftar
                </Link>
              </div>
            )}

            {commLoading ? (
              <div className="text-muted-foreground/40 flex items-center justify-center gap-2 py-8 text-sm">
                <div className="border-primary/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2" />
              </div>
            ) : comments.length === 0 ? (
              <div className="border-border/30 rounded-2xl border border-dashed py-10 text-center">
                <MessageCircle className="text-muted-foreground/20 mx-auto mb-2 h-8 w-8" />
                <p className="text-muted-foreground/40 text-sm">Belum ada komentar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    slug={slug}
                    isLoggedIn={isLoggedIn}
                    onReplyPosted={handleReplyPosted}
                    onToast={showToast}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-border/40 mt-12 border-t pt-8">
          <h3 className="mb-5 text-lg font-black">Artikel Lainnya</h3>
          <div className="grid grid-cols-3 gap-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="glass-card group hover:border-primary/30 flex flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
              >
                <div className="bg-muted/20 relative aspect-video overflow-hidden">
                  {p.coverurl ? (
                    <Image
                      src={p.coverurl}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="text-muted-foreground/20 h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="group-hover:text-primary line-clamp-2 text-xs font-bold transition-colors">
                    {p.title}
                  </p>
                  {(p.tags ?? []).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(p.tags ?? []).slice(0, 2).map((t: string) => (
                        <span key={t} className="text-muted-foreground/40 text-[9px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showShare && <ShareModal url={postUrl} title={title} onClose={() => setShowShare(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}
