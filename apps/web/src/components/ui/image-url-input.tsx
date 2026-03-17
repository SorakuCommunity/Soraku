"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Clipboard, X, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUrlInputProps {
  value:       string;
  onChange:    (url: string) => void;
  label?:      string;
  hint?:       string;
  required?:   boolean;
  placeholder?: string;
  previewClass?: string;   // class tambahan untuk preview image
  className?:  string;
  compact?:    boolean;    // mode kecil (untuk logo tim dll)
  icon?:       React.ReactNode;
}

export function ImageUrlInput({
  value, onChange,
  label, hint, required, placeholder = "https://...",
  previewClass, className, compact = false, icon,
}: ImageUrlInputProps) {
  const inputRef     = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"error">("idle");
  const [dragOver, setDragOver] = useState(false);

  const validate = useCallback((url: string) => {
    if (!url.trim()) { setStatus("idle"); return; }
    setStatus("loading");
    const img = document.createElement("img");
    img.onload  = () => setStatus("ok");
    img.onerror = () => setStatus("error");
    img.src = url;
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    validate(v);
  };

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);

    // Cek apakah ada file gambar di clipboard (copy image langsung)
    const imageItem = items.find(item => item.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;

      // Upload ke ImgBB atau fallback ke object URL sementara
      // Kita pakai free image hosting via freeimage.host API
      try {
        setStatus("loading");
        const fd = new FormData();
        fd.append("source", file);
        const res = await fetch("https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a2&action=upload&format=json", {
          method: "POST", body: fd,
        });
        const data = await res.json();
        if (data?.image?.url) {
          onChange(data.image.url);
          setStatus("ok");
          return;
        }
      } catch { /* fallback ke URL kosong */ }

      // Fallback: buat object URL lokal (temporary)
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
      setStatus("ok");
      return;
    }

    // Kalau yang di-paste adalah teks URL biasa
    const text = e.clipboardData.getData("text/plain").trim();
    if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
      // Biarkan default paste terjadi, lalu validate
      setTimeout(() => validate(text), 50);
    }
  }, [onChange, validate]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
      validate(objectUrl);
    } else {
      const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
      if (url) { onChange(url); validate(url); }
    }
  }, [onChange, validate]);

  const baseCls = cn(
    "w-full rounded-xl border bg-card/40 px-4 text-sm outline-none transition-all",
    "placeholder:text-muted-foreground/25",
    "focus:ring-2 focus:ring-primary/10",
    dragOver ? "border-primary/60 bg-primary/5" : "border-border/60 focus:border-primary/40",
    compact ? "py-2.5" : "py-3",
    className
  );

  const statusIcon = status === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/40" />
    : status === "ok"     ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
    : status === "error"  ? <AlertCircle  className="h-3.5 w-3.5 text-destructive/60" />
    : null;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-foreground/40">
          {icon}{label}
          {required && <span className="text-red-400">*</span>}
          <span className="ml-auto text-[9px] font-normal normal-case text-foreground/20">
            paste URL atau gambar
          </span>
        </label>
      )}

      {/* Preview + Input row */}
      {compact ? (
        <div className="flex gap-2.5 items-center">
          {/* Preview box */}
          <div className={cn(
            "h-12 w-12 flex-shrink-0 rounded-xl border bg-muted/20 overflow-hidden flex items-center justify-center",
            status === "error" ? "border-destructive/30" : "border-border/40"
          )}>
            {value && status !== "error" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover"
                onError={() => setStatus("error")} onLoad={() => setStatus("ok")} />
            ) : (
              <span className="text-xs text-muted-foreground/20">IMG</span>
            )}
          </div>

          {/* Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={e => handleChange(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              placeholder={placeholder}
              className={cn(baseCls, "pr-16")}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {statusIcon}
              {value && (
                <button type="button" onClick={() => { onChange(""); setStatus("idle"); }}
                  className="text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors">
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
              onChange={e => handleChange(e.target.value)}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              placeholder={placeholder}
              className={cn(baseCls, "pr-20")}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {statusIcon}
              <button type="button" title="Paste dari clipboard"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text.startsWith("http")) { onChange(text.trim()); validate(text.trim()); }
                  } catch { inputRef.current?.focus(); }
                }}
                className="text-muted-foreground/30 hover:text-primary/60 transition-colors p-0.5">
                <Clipboard className="h-3.5 w-3.5" />
              </button>
              {value && (
                <button type="button" onClick={() => { onChange(""); setStatus("idle"); }}
                  className="text-muted-foreground/30 hover:text-destructive/60 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          {value && status !== "error" && (
            <div className={cn(
              "relative overflow-hidden rounded-xl border border-border/40 bg-muted/10",
              previewClass ?? "h-32"
            )}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="preview"
                className="h-full w-full object-cover"
                onError={() => setStatus("error")} onLoad={() => setStatus("ok")} />
              <button type="button" onClick={() => { onChange(""); setStatus("idle"); }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 text-muted-foreground hover:text-destructive transition-colors backdrop-blur-sm">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {status === "error" && value && (
            <p className="flex items-center gap-1.5 text-[11px] text-destructive/70">
              <AlertCircle className="h-3 w-3" /> URL gambar tidak valid atau tidak bisa dimuat
            </p>
          )}
        </div>
      )}

      {hint && <p className="text-[11px] text-muted-foreground/30 pl-1">{hint}</p>}
    </div>
  );
}
