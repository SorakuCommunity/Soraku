"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart, MessageCircle, Share2, Copy, Check,
  Send, ChevronDown, ChevronUp, BookOpen,
  Twitter, Facebook, X, CheckCircle2, AlertCircle,
  Lock,
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

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl backdrop-blur-sm",
      type === "success" ? "border-green-500/30 bg-green-500/15 text-green-400" : "border-red-500/30 bg-red-500/15 text-red-400"
    )}>
      {type === "success" ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
    </div>
  );
}

// ─── Comment Item ─────────────────────────────────────────────────────────
function CommentItem({ comment, slug, isLoggedIn, onReplyPosted, onToast, depth = 0 }: {
  comment: Comment; slug: string; isLoggedIn: boolean; depth?: number;
  onReplyPosted: (c: Comment, parentId: string) => void;
  onToast: (msg: string, type: "success" | "error") => void;
}) {
  const [showReply,   setShowReply]   = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText,   setReplyText]   = useState("");
  const [sending,     setSending]     = useState(false);

  const name    = comment.author?.displayname ?? comment.author?.username ?? comment.guestname ?? "Anonim";
  const initial = name.charAt(0).toUpperCase();

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60)    return "baru saja";
    if (diff < 3600)  return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  const submitReply = async () => {
    if (!replyText.trim() || !isLoggedIn) return;
    setSending(true);
    try {
      const res  = await fetch(`/api/blog/${slug}/comments/${comment.id}/reply`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ content: replyText.trim() }),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data?.data?.id) {
        onReplyPosted(data.data, comment.id);
        setReplyText(""); setShowReply(false);
        onToast("Balasan terkirim!", "success");
      } else {
        onToast(data?.error?.message ?? "Gagal mengirim balasan.", "error");
      }
    } catch { onToast("Koneksi gagal.", "error"); }
    finally { setSending(false); }
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
            {isLoggedIn ? (
              <button onClick={() => setShowReply(!showReply)}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-primary transition-colors">
                <MessageCircle className="h-3 w-3" /> Balas
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-primary transition-colors">
                <Lock className="h-3 w-3" /> Login untuk balas
              </Link>
            )}
            {comment.replies.length > 0 && (
              <button onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors">
                {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {comment.replies.length} balasan
              </button>
            )}
          </div>
        )}
        {showReply && isLoggedIn && (
          <div className="mt-2 flex gap-2">
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={2}
              placeholder="Tulis balasan..."
              className="flex-1 resize-none rounded-xl border border-border/50 bg-card/30 px-3 py-2 text-sm outline-none focus:border-primary/40 transition-all" />
            <button onClick={submitReply} disabled={sending || !replyText.trim()}
              className="flex items-center justify-center rounded-xl bg-primary/80 px-3 text-white hover:bg-primary transition-colors disabled:opacity-40">
              {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        )}
        {showReplies && comment.replies.length > 0 && (
          <div className="mt-1">
            {comment.replies.map(r => (
              <CommentItem key={r.id} comment={r} slug={slug} isLoggedIn={isLoggedIn}
                onReplyPosted={onReplyPosted} onToast={onToast} depth={depth + 1} />
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
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-black">Bagikan Artikel</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Twitter/X", icon: <Twitter className="h-5 w-5 text-[#1DA1F2]" />, href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
            { label: "Facebook",  icon: <Facebook className="h-5 w-5 text-[#1877F2]" />, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
            { label: "WhatsApp",  icon: <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, href: `https://wa.me/?text=${enc(title + " " + url)}` },
          ].map(({ label, icon, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border/40 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all">
              {icon}<span className="text-[10px] text-muted-foreground/60">{label}</span>
            </a>
          ))}
        </div>
        <button onClick={copy}
          className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-2.5 hover:border-primary/40 transition-all">
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
  const [liked,       setLiked]       = useState(false);
  const [isLoggedIn,  setIsLoggedIn]  = useState(false);
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [commLoading, setCommLoading] = useState(true);
  const [commOpen,    setCommOpen]    = useState(true);
  const [newComment,  setNewComment]  = useState("");
  const [preview,     setPreview]     = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [showShare,   setShowShare]   = useState(false);
  const [toast,       setToast]       = useState<{ message: string; type: "success" | "error" } | null>(null);
  const viewCounted = useRef(false);
  const postUrl = `${siteUrl}/blog/${slug}`;

  const showToast = useCallback((message: string, type: "success" | "error") => setToast({ message, type }), []);

  // Check login status
  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.data?.id) setIsLoggedIn(true);
    }).catch(() => {});
  }, []);

  // Increment view once
  useEffect(() => {
    if (viewCounted.current) return;
    viewCounted.current = true;
    fetch(`/api/blog/${slug}/views`, { method: "POST" }).catch(() => {});
  }, [slug]);

  // Load like status — only if logged in (to persist per user)
  useEffect(() => {
    fetch(`/api/blog/${slug}/like`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setLikes(d.data.likecount ?? likecount);
          setLiked(d.data.reaction === "like");
        }
      }).catch(() => {});
  }, [slug, likecount]);

  // Load comments
  useEffect(() => {
    setCommLoading(true);
    fetch(`/api/blog/${slug}/comments`)
      .then(r => r.json())
      .then(d => {
        const list = d?.data?.comments;
        if (Array.isArray(list)) setComments(list);
      })
      .catch(() => {})
      .finally(() => setCommLoading(false));
  }, [slug]);

  const toggleLike = async () => {
    if (!isLoggedIn) {
      showToast("Login dulu untuk memberikan like!", "error");
      return;
    }
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikes(l => prevLiked ? Math.max(0, l - 1) : l + 1);
    try {
      const res = await fetch(`/api/blog/${slug}/like`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ type: "like" }),
      });
      const d = await res.json();
      if (d.data) { setLikes(d.data.likecount); setLiked(d.data.reaction === "like"); }
    } catch { setLiked(prevLiked); setLikes(l => prevLiked ? l + 1 : Math.max(0, l - 1)); }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    if (!isLoggedIn) { showToast("Harus login untuk berkomentar!", "error"); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ content: newComment.trim() }),
      });
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (res.ok && data?.data?.id) {
        setComments(prev => [data.data, ...prev]);
        setNewComment("");
        showToast("Komentar berhasil dikirim!", "success");
      } else {
        showToast(data?.error?.message ?? "Gagal mengirim komentar.", "error");
      }
    } catch { showToast("Koneksi gagal.", "error"); }
    finally { setSubmitting(false); }
  };

  const handleReplyPosted = useCallback((reply: Comment, parentId: string) => {
    if (!reply?.id) return;
    setComments(prev => prev.map(c =>
      c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c
    ));
  }, []);

  const totalComments = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <>
      <div className="mt-6"><MarkdownRenderer content={content} /></div>

      {/* Tags after article */}
      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5 border-t border-border/30 pt-5">
          {tags.map((t: string) => (
            <Link key={t} href={`/blog?tag=${t}`}
              className="rounded-full border border-border/50 bg-muted/20 px-3 py-1 text-xs text-muted-foreground/60 capitalize hover:border-primary/40 hover:text-primary transition-colors">
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border/40 bg-card/30 px-4 py-3">
        <button onClick={toggleLike}
          className={cn("flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
            liked ? "bg-red-500/15 border border-red-500/30 text-red-400" : "border border-border/50 text-muted-foreground hover:border-red-400/30 hover:text-red-400")}>
          <Heart className={cn("h-4 w-4", liked && "fill-current scale-110")} />
          <span>{likes}</span>
        </button>

        <button onClick={() => setCommOpen(o => !o)}
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

      {/* Comments — collapsible */}
      <div className="mt-8 space-y-4">
        <button onClick={() => setCommOpen(o => !o)}
          className="flex w-full items-center justify-between rounded-2xl border border-border/40 bg-card/30 px-5 py-3.5 hover:border-primary/30 transition-all">
          <h3 className="text-base font-black flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Komentar
            {totalComments > 0 && <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-sm text-primary">{totalComments}</span>}
          </h3>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground/50 transition-transform duration-200", commOpen && "rotate-180")} />
        </button>

        {commOpen && (
          <div className="space-y-4">
            {/* Form — require login */}
            {isLoggedIn ? (
              <div className="glass-card rounded-2xl p-4 space-y-3">
                <div className="flex gap-1 rounded-xl border border-border/40 bg-muted/10 p-1 w-fit">
                  {(["Tulis", "Preview"] as const).map(tab => (
                    <button key={tab} onClick={() => setPreview(tab === "Preview")}
                      className={cn("rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        preview === (tab === "Preview") ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>
                      {tab}
                    </button>
                  ))}
                </div>
                {preview ? (
                  <div className="min-h-[80px] rounded-xl border border-border/40 bg-black/10 px-4 py-3">
                    {newComment.trim() ? <MarkdownRenderer content={newComment} compact /> : <p className="text-xs text-muted-foreground/30 italic">Belum ada teks...</p>}
                  </div>
                ) : (
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={4}
                    placeholder="Tulis komentar... Mendukung **bold**, *italic*, `code`"
                    className="w-full resize-none rounded-xl border border-border/50 bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-foreground/15 focus:border-primary/40 transition-all font-mono" />
                )}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground/30">Mendukung **bold**, *italic*, `code`</p>
                  <button onClick={submitComment} disabled={submitting || !newComment.trim()}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-40">
                    {submitting ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-3.5 w-3.5" />}
                    Kirim
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-5 text-center space-y-3">
                <Lock className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground/60">Login untuk berkomentar</p>
                <Link href="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
                  Login / Daftar
                </Link>
              </div>
            )}

            {commLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground/40 text-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/30 py-10 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-sm text-muted-foreground/40">Belum ada komentar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(c => (
                  <CommentItem key={c.id} comment={c} slug={slug} isLoggedIn={isLoggedIn}
                    onReplyPosted={handleReplyPosted} onToast={showToast} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-border/40 pt-8">
          <h3 className="mb-5 text-lg font-black">Artikel Lainnya</h3>
          <div className="grid gap-3 grid-cols-3">
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
                  {(p.tags ?? []).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(p.tags ?? []).slice(0, 2).map((t: string) => <span key={t} className="text-[9px] text-muted-foreground/40">#{t}</span>)}
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
  );
}
