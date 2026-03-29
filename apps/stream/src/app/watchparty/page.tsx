"use client"
import { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Users, Send, Copy, Check, Loader2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "@/components/player/VideoPlayer"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Msg { id: string; user: string; text: string; ts: number; isSystem?: boolean }
const genId   = () => Math.random().toString(36).slice(2, 9)
const genRoom = () => Math.random().toString(36).slice(2, 8).toUpperCase()

function WatchPartyInner() {
  const sp = useSearchParams()
  const animeId = sp.get("anime") ?? ""
  const source  = sp.get("source") ?? "hianime"
  const title   = sp.get("title") ?? "Anime"
  const roomParam = sp.get("room") ?? ""

  const [roomId]   = useState(roomParam || genRoom())
  const [userId]   = useState(() => genId())
  const [username, setUsername] = useState(`Viewer${Math.floor(Math.random() * 9000) + 1000}`)
  const [isHost]   = useState(!roomParam)
  const [viewers,  setViewers]  = useState(1)
  const [joined,   setJoined]   = useState(false)

  const [streamUrl,  setStreamUrl]  = useState<string | null>(null)
  const [syncTime,   setSyncTime]   = useState<number | null>(null)
  const [syncPaused, setSyncPaused] = useState<boolean | null>(null)

  const [chat,     setChat]     = useState<Msg[]>([])
  const [chatInput,setChatInput]= useState("")
  const [copied,   setCopied]   = useState(false)
  const chatEndRef  = useRef<HTMLDivElement>(null)
  const channelRef  = useRef<any>(null)

  const roomUrl = `${typeof window !== "undefined" ? window.location.origin : "https://soraku.live"}/watchparty?room=${roomId}&anime=${encodeURIComponent(animeId)}&source=${source}&title=${encodeURIComponent(title)}`

  const addSystem = (text: string) =>
    setChat(p => [...p, { id: genId(), user: "Sistem", text, ts: Date.now(), isSystem: true }])

  useEffect(() => {
    const ch = supabase.channel(`wp:${roomId}`, { config: { presence: { key: userId } } })
    channelRef.current = ch

    ch.on("presence", { event: "sync" }, () => {
      setViewers(Object.keys(ch.presenceState()).length)
    })
    .on("presence", { event: "join" }, ({ newPresences }: any) => {
      const name = newPresences[0]?.username ?? "Seseorang"
      addSystem(`${name} bergabung`)
    })
    .on("presence", { event: "leave" }, ({ leftPresences }: any) => {
      addSystem(`${leftPresences[0]?.username ?? "Seseorang"} keluar`)
    })
    .on("broadcast", { event: "chat" }, ({ payload }: any) => {
      setChat(p => [...p, payload])
    })
    .on("broadcast", { event: "sync" }, ({ payload }: any) => {
      if (!isHost) { setSyncTime(payload.currentTime); setSyncPaused(payload.isPaused) }
    })
    .on("broadcast", { event: "stream" }, ({ payload }: any) => {
      if (!isHost && payload.url) setStreamUrl(payload.url)
    })
    .subscribe(async (status: string) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ userId, username })
        setJoined(true)
        addSystem(isHost ? `Room ${roomId} dibuat` : `Bergabung ke room ${roomId}`)
      }
    })

    return () => { ch.unsubscribe() }
  }, [roomId, userId, username, isHost])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  const handleTimeUpdate = useCallback((t: number) => {
    if (!isHost || !channelRef.current) return
    channelRef.current.send({ type: "broadcast", event: "sync", payload: { currentTime: t, isPaused: syncPaused ?? false } })
  }, [isHost, syncPaused])

  const handlePlayPause = useCallback((paused: boolean) => {
    setSyncPaused(paused)
    if (isHost && channelRef.current) {
      channelRef.current.send({ type: "broadcast", event: "sync", payload: { currentTime: syncTime ?? 0, isPaused: paused } })
    }
  }, [isHost, syncTime])

  const loadStream = async (epId: string) => {
    const res  = await fetch(`/api/ext/stream/${encodeURIComponent(epId)}?anime=true&source=${source}`)
    const data = await res.json()
    if (data?.data?.streams?.length > 0) {
      const url = data.data.streams.find((s: any) => s.isM3U8)?.url ?? data.data.streams[0].url
      setStreamUrl(url)
      channelRef.current?.send({ type: "broadcast", event: "stream", payload: { url } })
    }
  }

  const sendChat = () => {
    if (!chatInput.trim() || !channelRef.current) return
    const msg: Msg = { id: genId(), user: username, text: chatInput.trim(), ts: Date.now() }
    channelRef.current.send({ type: "broadcast", event: "chat", payload: msg })
    setChat(p => [...p, msg])
    setChatInput("")
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(roomUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Users className="h-4.5 w-4.5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">Watch Party</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5">{roomId}</span>
            {isHost && <span className="flex items-center gap-1 text-[11px] text-amber-400"><Crown className="h-3 w-3" /> Host</span>}
            <span className="flex items-center gap-1 text-[11px] text-green-400">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400" />{viewers} online
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Player */}
        <div className="space-y-3">
          {streamUrl ? (
            <VideoPlayer src={streamUrl} title={title}
              syncTime={!isHost ? syncTime : undefined}
              syncPaused={!isHost ? syncPaused : undefined}
              onTimeUpdate={handleTimeUpdate} onPlayPause={handlePlayPause} />
          ) : (
            <div className="w-full bg-zinc-900 rounded-xl flex flex-col items-center justify-center gap-3 text-zinc-500" style={{ aspectRatio: "16/9" }}>
              <Users className="h-10 w-10 text-zinc-700" />
              <p className="text-sm">{isHost ? "Pilih episode untuk mulai streaming" : "Menunggu host memilih episode..."}</p>
            </div>
          )}

          {/* Share link */}
          <div className="flex items-center gap-2 rounded-lg border border-white/[.06] bg-zinc-900/50 px-3 py-2">
            <span className="font-mono text-xs text-zinc-500 flex-1 truncate">{roomUrl}</span>
            <button onClick={copyLink}
              className="flex items-center gap-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors flex-shrink-0">
              {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Share</>}
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="flex flex-col rounded-xl border border-white/[.06] bg-zinc-900/50 overflow-hidden" style={{ height: "540px" }}>
          <div className="border-b border-white/[.06] px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Live Chat</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-green-400" />{viewers} online
            </span>
          </div>
          <div className="px-3 py-2 border-b border-white/[.04]">
            <input value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Username..."
              className="w-full rounded-md bg-zinc-800 border border-white/[.06] px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/40 transition-all" />
          </div>
          <div className="flex-1 overflow-y-auto ep-scroll px-3 py-3 space-y-2">
            {chat.map(m => (
              <div key={m.id} className={cn("text-xs", m.isSystem && "text-center italic text-zinc-600")}>
                {m.isSystem ? m.text : (
                  <span>
                    <span className={cn("font-semibold mr-1.5",
                      m.user === username ? "text-indigo-400" : "text-violet-400"
                    )}>{m.user}</span>
                    <span className="text-zinc-300">{m.text}</span>
                  </span>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-white/[.06] p-3 flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Tulis pesan..."
              className="flex-1 rounded-lg bg-zinc-800 border border-white/[.06] px-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/40 transition-all" />
            <button onClick={sendChat} disabled={!chatInput.trim()}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition-colors">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WatchPartyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-400" />
      </div>
    }>
      <WatchPartyInner />
    </Suspense>
  )
}
