"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, ThumbsDown, MessageCircle, Share2, Copy, Check,
  Send, User, ChevronDown, ChevronUp, BookOpen,
  Twitter, Facebook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Author { username: string | null; displayname: string | null; avatarurl: string | null; }
interface Comment {
  id: string; parentid: string | null; userid: string | null; guestname: string | null;
  content: string; createdat: string; author: Author | null; replies: Comment[];
}
interface RelatedPost {
  id: string; slug: string; title: string; excerpt: string | null;
  coverurl: string | null; tags: string[]; publishedat: string;
}
interface Props {
  slug: string; content: string; likecount: number; siteUrl: string;
  title: string; tags: string[]; related: RelatedPost[];
}

// ─── Comment Item ─────────────────────────────────────────────────────────

function CommentItem({ comment, slug, onReplyPosted, depth = 0 }: {
  comment: Comment; slug: string;
  onReplyPosted: (c: Comment, parentId: string) => void; depth?: number;
}) {
  const [showReply,   setShowReply]   = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText,   setReplyText]   = useState("");
  const [guestName,   setGuestName]   = useState("");
  const [sending,     setSending]     = useState(false);

  const name    = comment.author?.displayname ?? comment.author?.username ?? comment.guestname ?? "Anonim";
  const initial = name.charAt(0).toUpperCase();

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60)    return "baru saja";
    if (diff < 3600)  return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    const res  = await fetch(`/api/blog/${slug}/comments/${comment.id}/reply`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body:   JSON.stringify({ content: replyText.trim(), guestname: guestName.trim() || undefined }),
    });
    const data = await res.json();
    if (res.ok) { onReplyPosted(data.data, comment.id); setReplyText(""); setGuestName(""); setShowReply(false); }
    setSending(false);
  };

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-8 mt-3")}>
      <div className="flex-shrink-0">
        {comment.author?.avatarurl
          ? <Image src={comment.author.avatarurl} alt={name} width={32} height={32} className="rounded-xl" unoptimized />
          : <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-xs font-black text-primary">{initial}</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-card/50 border border-border/30 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-foreground/80">{name}</span>
            <span className="text-[10px] text-muted-foreground/40">{timeAgo(comment.createdat)}</span>
          </div>
          <MarkdownRenderer content={comment.content} compact />
        </div>
        {depth === 0 && (
          <div className="mt-1.5 flex items-center gap-3 px-1">
            <button onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-primary transition-colors">
              <MessageCircle className="h-3.5 w-3.5" /> Balas
            </button>
            {comment.replies.length > 0 && (
              <button onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors">
                {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {comment.replies.length} balasan
              </button>
            )}
          </div>
        )}
        {showReply && (
          <div className="mt-2 space-y-2">
            <input value={guestName} onChange={e => setGuestName(e.target.value)}
              placeholder="Nama kamu (opsional jika sudah login)"
              className="w-full rounded-xl border border-border/50 bg-card/30 px-3 py-2 text-xs outline-none focus:border-primary/40 transition-all" />
            <div className="flex gap-2">
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2}
                placeholder="Tulis balasan... (mendukung **markdown**)"
                className="flex-1 resize-none rounded-xl border border-border/50 bg-card/30 px-3 py-2 text-sm outline-none focus:border-primary/40 transition-all" />
              <button onClick={submitReply} disabled={sending || !replyText.trim()}
                className="flex items-center justify-center rounded-xl bg-primary/80 px-3 text-white hover:bg-primary transition-colors disabled:opacity-40">
                {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map(r => (
              <CommentItem key={r.id} comment={r} slug={slug} onReplyPosted={onReplyPosted} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────

function ShareModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-black">Bagikan Artikel</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Twitter/X", icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
            { label: "Facebook",  icon: <Facebook className="h-5 w-5 text-[#1877F2]" />, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
            { label: "WhatsApp",  icon: (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            ), href: `https://wa.me/?text=${enc(title + " " + url)}` },
          ].map(({ label, icon, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border/40 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
              {icon}
              <span className="text-[10px] text-muted-foreground/60">{label}</span>
            </a>
          ))}
        </div>
        <button onClick={copy}
          className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 text-sm hover:border-primary/40 transition-all">
          <span className="font-mono text-xs text-muted-foreground/60 truncate">{url}</span>
          <div className="ml-2 flex-shrink-0">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        </button>
        <button onClick={onClose} className="w-full rounded-xl border border-border/40 py-2 text-xs text-muted-foreground/50 hover:text-foreground transition-colors">Tutup</button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────

export default function BlogDetailClient({ slug, content, likecount, siteUrl, title, tags, related }: Props) {
  const [likes,       setLikes]       = useState(likecount);
  const [dislikes,    setDislikes]    = useState(0);
  const [reaction,    setReaction]    = useState<'like' | 'dislike' | null>(null);
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [commLoading, setCommLoading] = useState(true);
  const [newComment,  setNewComment]  = useState("");
  const [guestName,   setGuestName]   = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [showShare,   setShowShare]   = useState(false);
  const [preview,     setPreview]     = useState(false);
  const viewCounted = useRef(false);
  const postUrl = `${siteUrl}/blog/${slug}`;

  // Increment view once
  useEffect(() => {
    if (viewCounted.current) return;
    viewCounted.current = true;
    fetch(`/api/blog/${slug}/views`, { method: "POST" }).catch(() => {});
  }, [slug]);

  // Load reaction status
  useEffect(() => {
    fetch(`/api/blog/${slug}/like`)
      .then(r => r.json())
      .then(d => {
        if (d.data) { setLikes(d.data.likecount); setDislikes(d.data.dislikecount ?? 0); setReaction(d.data.reaction); }
      }).catch(() => {});
  }, [slug]);

  // Load comments
  useEffect(() => {
    setCommLoading(true);
    fetch(`/api/blog/${slug}/comments`)
      .then(r => r.json())
      .then(d => { if (d.data) setComments(d.data.comments); })
      .finally(() => setCommLoading(false));
  }, [slug]);

  const sendReaction = async (type: 'like' | 'dislike') => {
    const prev = reaction;
    // Optimistic update
    if (type === 'like') {
      if (prev === 'like') { setLikes(l => Math.max(0, l - 1)); setReaction(null); }
      else { setLikes(l => l + 1); if (prev === 'dislike') setDislikes(d => Math.max(0, d - 1)); setReaction('like'); }
    } else {
      if (prev === 'dislike') { setDislikes(d => Math.max(0, d - 1)); setReaction(null); }
      else { setDislikes(d => d + 1); if (prev === 'like') setLikes(l => Math.max(0, l - 1)); setReaction('dislike'); }
    }
    const res = await fetch(`/api/blog/${slug}/like`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body:   JSON.stringify({ type }),
    });
    const d = await res.json();
    if (d.data) { setLikes(d.data.likecount); setDislikes(d.data.dislikecount ?? 0); setReaction(d.data.reaction); }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    const res  = await fetch(`/api/blog/${slug}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body:   JSON.stringify({ content: newComment.trim(), guestname: guestName.trim() || undefined }),
    });
    const data = await res.json();
    if (res.ok) { setComments(prev => [data.data, ...prev]); setNewComment(""); setGuestName(""); }
    setSubmitting(false);
  };

  const handleReplyPosted = (reply: Comment, parentId: string) => {
    setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c));
  };

  const totalComments = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <>
      {/* Article Content */}
      <div className="mt-6"><MarkdownRenderer content={content} /></div>

      {/* Hashtags */}
      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5 border-t border-border/30 pt-5">
          {tags.map(t => (
            <Link key={t} href={`/blog?tag=${t}`}
              className="rounded-full border border-border/50 bg-muted/20 px-3 py-1 text-xs text-muted-foreground/60 capitalize hover:border-primary/40 hover:text-primary transition-colors">
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border/40 bg-card/30 px-4 py-3">
        {/* Like */}
        <button onClick={() => sendReaction('like')}
          className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
            reaction === 'like'
              ? "bg-green-500/15 border border-green-500/30 text-green-400"
              : "border border-border/50 text-muted-foreground hover:border-green-400/30 hover:text-green-400")}>
          <Heart className={cn("h-4 w-4 transition-transform", reaction === 'like' && "fill-current scale-110")} />
          <span>{likes}</span>
        </button>

        {/* Dislike */}
        <button onClick={() => sendReaction('dislike')}
          className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
            reaction === 'dislike'
              ? "bg-red-500/15 border border-red-500/30 text-red-400"
              : "border border-border/50 text-muted-foreground hover:border-red-400/30 hover:text-red-400")}>
          <ThumbsDown className={cn("h-4 w-4 transition-transform", reaction === 'dislike' && "fill-current scale-110")} />
          {dislikes > 0 && <span>{dislikes}</span>}
        </button>

        {/* Comments jump */}
        <button onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
          <MessageCircle className="h-4 w-4" />
          <span>{totalComments}</span>
        </button>

        <div className="ml-auto">
          <button onClick={() => setShowShare(true)}
            className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            <Share2 className="h-4 w-4" /> Bagikan
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments-section" className="mt-8 space-y-5">
        <h3 className="text-lg font-black flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" /> Komentar
          {totalComments > 0 && <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm text-primary">{totalComments}</span>}
        </h3>

        {/* Comment form */}
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/50">
            <User className="h-3.5 w-3.5" /> Tulis Komentar
          </div>
          <input value={guestName} onChange={e => setGuestName(e.target.value)}
            placeholder="Nama kamu (opsional jika sudah login)"
            className="w-full rounded-xl border border-border/50 bg-black/20 px-3 py-2 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/40 transition-all" />
          <div className="flex gap-1 rounded-xl border border-border/40 bg-muted/10 p-1 w-fit">
            {(['write', 'preview'] as const).map(tab => (
              <button key={tab} onClick={() => setPreview(tab === 'preview')}
                className={cn("rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  preview === (tab === 'preview') ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                {tab === 'write' ? 'Tulis' : 'Preview'}
              </button>
            ))}
          </div>
          {preview ? (
            <div className="min-h-[80px] rounded-xl border border-border/40 bg-black/10 px-4 py-3">
              {newComment.trim() ? <MarkdownRenderer content={newComment} compact /> : <p className="text-xs text-muted-foreground/30 italic">Belum ada teks...</p>}
            </div>
          ) : (
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={4}
              placeholder="Tulis komentar... Mendukung **bold**, *italic*, `code`, ## heading"
              className="w-full resize-none rounded-xl border border-border/50 bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-foreground/15 focus:border-primary/40 transition-all font-mono" />
          )}
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/30">Mendukung **bold**, *italic*, `code`, [link](url)</p>
            <button onClick={submitComment} disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-40">
              {submitting ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-3.5 w-3.5" />}
              Kirim
            </button>
          </div>
        </div>

        {/* Comments list */}
        {commLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground/40 text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" /> Memuat komentar...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/30 py-10 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/20 mb-2" />
            <p className="text-sm text-muted-foreground/40">Jadilah yang pertama berkomentar!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map(c => (
              <CommentItem key={c.id} comment={c} slug={slug} onReplyPosted={handleReplyPosted} />
            ))}
          </div>
        )}
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-border/40 pt-8">
          <h3 className="mb-5 text-lg font-black">Artikel Lainnya</h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {related.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`}
                className="glass-card group flex flex-col overflow-hidden rounded-xl hover:-translate-y-0.5 hover:border-primary/30 transition-all">
                <div className="relative aspect-video overflow-hidden bg-muted/20">
                  {p.coverurl
                    ? <Image src={p.coverurl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    : <div className="flex h-full items-center justify-center"><BookOpen className="h-6 w-6 text-muted-foreground/20" /></div>
                  }
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold line-clamp-2 group-hover:text-primary transition-colors">{p.title}</p>
                  {p.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] text-muted-foreground/40">#{t}</span>)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showShare && <ShareModal url={postUrl} title={title} onClose={() => setShowShare(false)} />}
    </>
  );
}
