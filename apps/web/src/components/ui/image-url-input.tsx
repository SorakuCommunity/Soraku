'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Clipboard, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUrlInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
  required?: boolean
  placeholder?: string
  previewClass?: string // class tambahan untuk preview image
  className?: string
  compact?: boolean // mode kecil (untuk logo tim dll)
  icon?: React.ReactNode
}

export function ImageUrlInput({
  value,
  onChange,
  label,
  hint,
  required,
  placeholder = 'https://...',
  previewClass,
  className,
  compact = false,
  icon,
}: ImageUrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [dragOver, setDragOver] = useState(false)

  const validate = useCallback((url: string) => {
    if (!url.trim()) {
      setStatus('idle')
      return
    }
    setStatus('loading')
    const img = document.createElement('img')
    img.onload = () => setStatus('ok')
    img.onerror = () => setStatus('error')
    img.src = url
  }, [])

  const handleChange = (v: string) => {
    onChange(v)
    validate(v)
  }

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items)

      // Cek apakah ada file gambar di clipboard (copy image langsung)
      const imageItem = items.find((item) => item.type.startsWith('image/'))
      if (imageItem) {
        e.preventDefault()
        const file = imageItem.getAsFile()
        if (!file) return

        // Upload ke ImgBB atau fallback ke object URL sementara
        // Upload via Supabase Storage
        try {
          setStatus('loading')
          const fd = new FormData()
          fd.append('file', file)
          fd.append('bucket', 'events')
          fd.append('folder', 'uploads')
          const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
          const data = await res.json()
          if (res.ok && data?.data?.url) {
            onChange(data.data.url)
            setStatus('ok')
            return
          }
        } catch {
          /* fallback ke object URL */
        }

        // Fallback: buat object URL lokal (temporary)
        const objectUrl = URL.createObjectURL(file)
        onChange(objectUrl)
        setStatus('ok')
        return
      }

      // Kalau yang di-paste adalah teks URL biasa
      const text = e.clipboardData.getData('text/plain').trim()
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        // Biarkan default paste terjadi, lalu validate
        setTimeout(() => validate(text), 50)
      }
    },
    [onChange, validate]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file)
        onChange(objectUrl)
        validate(objectUrl)
      } else {
        const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain')
        if (url) {
          onChange(url)
          validate(url)
        }
      }
    },
    [onChange, validate]
  )

  const baseCls = cn(
    'w-full rounded-xl border bg-card/40 px-4 text-sm outline-none transition-all',
    'placeholder:text-muted-foreground/25',
    'focus:ring-2 focus:ring-primary/10',
    dragOver ? 'border-primary/60 bg-primary/5' : 'border-border/60 focus:border-primary/40',
    compact ? 'py-2.5' : 'py-3',
    className
  )

  const statusIcon =
    status === 'loading' ? (
      <Loader2 className="text-muted-foreground/40 h-3.5 w-3.5 animate-spin" />
    ) : status === 'ok' ? (
      <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
    ) : status === 'error' ? (
      <AlertCircle className="text-destructive/60 h-3.5 w-3.5" />
    ) : null

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-foreground/40 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
          {icon}
          {label}
          {required && <span className="text-red-400">*</span>}
          <span className="text-foreground/20 ml-auto text-[9px] font-normal normal-case">
            paste URL atau gambar
          </span>
        </label>
      )}

      {/* Preview + Input row */}
      {compact ? (
        <div className="flex items-center gap-2.5">
          {/* Preview box */}
          <div
            className={cn(
              'bg-muted/20 flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border',
              status === 'error' ? 'border-destructive/30' : 'border-border/40'
            )}
          >
            {value && status !== 'error' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="h-full w-full object-cover"
                onError={() => setStatus('error')}
                onLoad={() => setStatus('ok')}
              />
            ) : (
              <span className="text-muted-foreground/20 text-xs">IMG</span>
            )}
          </div>

          {/* Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              placeholder={placeholder}
              className={cn(baseCls, 'pr-16')}
            />
            <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1.5">
              {statusIcon}
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setStatus('idle')
                  }}
                  className="text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              placeholder={placeholder}
              className={cn(baseCls, 'pr-20')}
            />
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              {statusIcon}
              <button
                type="button"
                title="Paste dari clipboard"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText()
                    if (text.startsWith('http')) {
                      onChange(text.trim())
                      validate(text.trim())
                    }
                  } catch {
                    inputRef.current?.focus()
                  }
                }}
                className="text-muted-foreground/30 hover:text-primary/60 p-0.5 transition-colors"
              >
                <Clipboard className="h-3.5 w-3.5" />
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setStatus('idle')
                  }}
                  className="text-muted-foreground/30 hover:text-destructive/60 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          {value && status !== 'error' && (
            <div
              className={cn(
                'border-border/40 bg-muted/10 relative overflow-hidden rounded-xl border',
                previewClass ?? 'h-32'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="preview"
                className="h-full w-full object-cover"
                onError={() => setStatus('error')}
                onLoad={() => setStatus('ok')}
              />
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setStatus('idle')
                }}
                className="bg-background/80 text-muted-foreground hover:text-destructive absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg backdrop-blur-sm transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {status === 'error' && value && (
            <p className="text-destructive/70 flex items-center gap-1.5 text-[11px]">
              <AlertCircle className="h-3 w-3" /> URL gambar tidak valid atau tidak bisa dimuat
            </p>
          )}
        </div>
      )}

      {hint && <p className="text-muted-foreground/30 pl-1 text-[11px]">{hint}</p>}
    </div>
  )
}
