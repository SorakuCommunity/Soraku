"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload, Search, X, ZoomIn, ImageIcon, Filter,
  ChevronLeft, ChevronRight, Heart, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface GalleryItem {
  id: string;
  imageurl: string | null;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  status: string;
  createdat: string;
}

// ─── Constants ────────────────────────────────────────────────────────────

const FILTERS = [
  { slug:"semua",   label:"Semua",   emoji:"✨" },
  { slug:"fanart",  label:"Fanart",  emoji:"🎨" },
  { slug:"cosplay", label:"Cosplay", emoji:"👘" },
  { slug:"digital", label:"Digital", emoji:"💻" },
  { slug:"foto",    label:"Foto",    emoji:"📷" },
  { slug:"lainnya", label:"Lainnya", emoji:"🌸" },
];

const PLACEHOLDER_COLORS = [
  "from-pink-500/15 to-rose-400/10",
  "from-violet-500/15 to-purple-400/10",
  "from-blue-500/15 to-cyan-400/10",
  "from-amber-500/15 to-yellow-400/10",
  "from-green-500/15 to-emerald-400/10",
  "from-primary/15 to-accent/10",
];

// ─── Lightbox ────────────────────────────────────────────────────────────

function Lightbox({ item, items, onClose, onPrev, onNext }: {
  item: GalleryItem; items: GalleryItem[];
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const idx = items.findIndex(i => i.id === item.id);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}>
      <button onClick={(e)=>{e.stopPropagation();onPrev();}}
        className={cn("absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 hover:bg-white/15 hover:text-white transition-all",idx<=0&&"opacity-30 pointer-events-none")}>
        <ChevronLeft className="h-5 w-5"/>
      </button>
      <button onClick={(e)=>{e.stopPropagation();onNext();}}
        className={cn("absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 hover:bg-white/15 hover:text-white transition-all",idx>=items.length-1&&"opacity-30 pointer-events-none")}>
        <ChevronRight className="h-5 w-5"/>
      </button>
      <button onClick={onClose}
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 hover:bg-white/15 hover:text-white transition-all">
        <X className="h-4 w-4"/>
      </button>

      <div className="relative max-w-4xl max-h-[85vh] mx-16 flex flex-col items-center gap-4"
        onClick={e=>e.stopPropagation()}>
        {item.imageurl ? (
          <div className="relative max-h-[72vh] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageurl} alt={item.title??""} className="max-h-[72vh] max-w-full object-contain rounded-2xl"/>
          </div>
        ) : (
          <div className={cn("h-64 w-80 rounded-2xl bg-gradient-to-br",PLACEHOLDER_COLORS[0],"flex items-center justify-center")}>
            <ImageIcon className="h-12 w-12 text-white/20"/>
          </div>
        )}

        {/* Info bar */}
        <div className="flex items-start justify-between gap-4 w-full max-w-2xl px-1">
          <div className="min-w-0 flex-1">
            {item.title && <p className="font-black text-white/90 truncate">{item.title}</p>}
            {item.description && <p className="text-sm text-white/45 mt-0.5 line-clamp-2">{item.description}</p>}
          </div>
          {(item.tags??[]).length>0&&(
            <div className="flex flex-wrap gap-1.5 flex-shrink-0">
              {(item.tags??[]).map(t=>(
                <span key={t} className="rounded-full border border-white/12 bg-white/8 px-2.5 py-0.5 text-[10px] font-semibold text-white/50 capitalize">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Counter */}
        <p className="text-[11px] text-white/25">{idx+1} / {items.length}</p>
      </div>
    </div>
  );
}

// ─── Upload Modal ────────────────────────────────────────────────────────

function UploadModal({ onClose }: { onClose: () => void }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",h);
    return ()=>document.removeEventListener("keydown",h);
  },[onClose]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) { setError("File harus berupa gambar."); return; }
    if (f.size > 8*1024*1024) { setError("Maks 8MB."); return; }
    setFile(f); setError(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError("Pilih gambar dulu."); return; }
    if (!title.trim()) { setError("Judul wajib diisi."); return; }
    setLoading(true); setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("title", title.trim());
    form.append("description", desc.trim());
    const tags = [category, ...title.toLowerCase().split(" ").slice(0,3)].filter(Boolean).join(",");
    form.append("tags", tags);
    try {
      const res = await fetch("/api/gallery/upload", { method:"POST", body:form });
      const data = await res.json();
      if (!res.ok) { setError(data?.error?.message??"Gagal upload."); return; }
      setSuccess(true);
    } catch { setError("Koneksi gagal. Coba lagi."); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-3xl border border-border/60 bg-card/95 p-8 text-center" onClick={e=>e.stopPropagation()}>
        <div className="mb-4 text-5xl">🌸</div>
        <h3 className="text-xl font-black mb-2">Karya Terkirim!</h3>
        <p className="text-sm text-muted-foreground/60 mb-6">Sedang ditinjau admin. Akan muncul di galeri setelah disetujui.</p>
        <button onClick={onClose} className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
          Oke, Tutup
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-border/60 bg-card/98 backdrop-blur-xl overflow-y-auto max-h-[90vh]"
        onClick={e=>e.stopPropagation()}>

        {/* Handle bar mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1"><div className="h-1 w-10 rounded-full bg-border/60"/></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h3 className="text-base font-black">Upload Karya</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
            <X className="h-4 w-4"/>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
            onClick={()=>fileRef.current?.click()}
            className={cn(
              "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden",
              drag ? "border-primary/60 bg-primary/8" : preview ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/40 bg-muted/8 hover:border-primary/30 hover:bg-primary/5"
            )}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);}}/>
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="w-full max-h-56 object-cover"/>
                <button type="button" onClick={e=>{e.stopPropagation();setFile(null);setPreview(null);}}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white/80 hover:bg-black/90 transition-colors">
                  <X className="h-3.5 w-3.5"/>
                </button>
                <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] text-white/80 font-semibold">
                  {file?.name} · {((file?.size??0)/1024/1024).toFixed(1)}MB
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Upload className="h-8 w-8 text-muted-foreground/30"/>
                <p className="text-sm font-semibold text-muted-foreground/60">Klik atau drag & drop gambar</p>
                <p className="text-xs text-muted-foreground/35">JPG, PNG, WebP, GIF · Maks 8MB</p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Judul <span className="text-red-400">*</span></label>
              <input value={title} onChange={e=>setTitle(e.target.value)} maxLength={100}
                placeholder="Judul karya kamu"
                className="w-full rounded-xl border border-border/50 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"/>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {FILTERS.slice(1).map(f=>(
                  <button key={f.slug} type="button" onClick={()=>setCategory(category===f.slug?"":f.slug)}
                    className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                      category===f.slug ? "border-primary/40 bg-primary/12 text-primary" : "border-border/40 text-muted-foreground/60 hover:border-primary/25 hover:text-foreground")}>
                    {f.emoji} {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Deskripsi</label>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} maxLength={300}
                placeholder="Cerita di balik karya ini (opsional)"
                className="w-full resize-none rounded-xl border border-border/50 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-foreground/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"/>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-400">
              <X className="h-4 w-4 flex-shrink-0"/> {error}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground/35 text-center">
            Karya akan ditinjau admin sebelum tampil di galeri publik
          </p>

          <button onClick={handleSubmit} disabled={loading||!file||!title.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/> Mengupload...</>
            ) : (
              <><Upload className="h-4 w-4"/> Upload Karya</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<GalleryItem|null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchGallery = useCallback(async (filter:string, q:string, p:number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page:String(p), limit:"24" });
      if (filter!=="semua") params.set("tag", filter);
      if (q.trim()) params.set("search", q.trim());
      const res = await fetch(`/api/gallery?${params}`);
      const data = await res.json();
      setItems(data.data??[]);
      setTotal(data.meta?.total??0);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGallery(activeFilter, search, page); }, [activeFilter, page, fetchGallery]);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchTimeout.current !== null) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setPage(1); fetchGallery(activeFilter, v, 1); }, 400);
  };

  const handleFilter = (f: string) => { setActiveFilter(f); setPage(1); };

  const lbIdx = lightbox ? items.findIndex(i=>i.id===lightbox.id) : -1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/40 mb-2">Komunitas</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl mb-1">
          Galeri <span className="text-gradient">Karya</span>
        </h1>
        <p className="text-sm text-muted-foreground/55">Fanart, cosplay, dan karya kreatif dari anggota Soraku.</p>
      </div>

      {/* ── Search + Upload (sejajar) ── */}
      <div className="mb-5 flex items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/35 pointer-events-none"/>
          <input
            type="text"
            value={search}
            onChange={e=>handleSearch(e.target.value)}
            placeholder="Cari karya..."
            className="w-full rounded-2xl border border-border/50 bg-card/30 pl-10 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {search && (
            <button onClick={()=>handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5"/>
            </button>
          )}
        </div>

        {/* Upload button — sejajar search */}
        <button onClick={()=>setShowUpload(true)}
          className="flex flex-shrink-0 items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/30 transition-all">
          <Upload className="h-4 w-4"/>
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="mb-7 flex flex-wrap gap-2">
        {FILTERS.map(f=>(
          <button key={f.slug} onClick={()=>handleFilter(f.slug)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
              activeFilter===f.slug
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "border border-border/50 text-muted-foreground/60 hover:border-primary/35 hover:text-foreground hover:-translate-y-0.5"
            )}>
            {f.emoji} {f.label}
          </button>
        ))}
        <span className="ml-auto flex items-center text-xs text-muted-foreground/35">
          {loading ? "..." : `${total.toLocaleString("id-ID")} karya`}
        </span>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} className="mb-3 break-inside-avoid animate-pulse rounded-2xl bg-muted/12"
              style={{height:`${[180,140,160,200,150,175][i%6]}px`}}/>
          ))}
        </div>
      ) : items.length===0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-muted-foreground/50 text-sm">Belum ada karya {search?`untuk "${search}"`:`di kategori ini`}.</p>
          <button onClick={()=>setShowUpload(true)}
            className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Upload karya pertama <Upload className="h-3.5 w-3.5"/>
          </button>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {items.map((item, idx) => (
            <div key={item.id}
              className="group mb-3 break-inside-avoid cursor-pointer overflow-hidden rounded-2xl border border-border/30 bg-card/20 hover:border-primary/30 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5"
              onClick={()=>setLightbox(item)}>
              {item.imageurl ? (
                <div className={cn("relative w-full overflow-hidden",
                  idx%4===0?"h-52":idx%4===1?"h-36":idx%4===2?"h-44":"h-40")}>
                  <Image src={item.imageurl} alt={item.title??""} fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px)50vw,(max-width:1024px)33vw,25vw"/>
                  {/* Hover overlay — seamless fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
                      <ZoomIn className="h-3.5 w-3.5"/> Lihat
                    </div>
                  </div>
                  {/* Tag badge */}
                  {(item.tags??[]).length>0&&(
                    <span className="absolute top-2 left-2 rounded-full border border-white/12 bg-black/40 px-2 py-0.5 text-[9px] font-semibold text-white/65 capitalize backdrop-blur-sm">
                      {(item.tags??[])[0]}
                    </span>
                  )}
                </div>
              ) : (
                <div className={cn("w-full bg-gradient-to-br flex items-center justify-center",
                  PLACEHOLDER_COLORS[idx%PLACEHOLDER_COLORS.length],
                  idx%4===0?"h-52":idx%4===1?"h-36":idx%4===2?"h-44":"h-40")}>
                  <ImageIcon className="h-8 w-8 text-white/15"/>
                </div>
              )}
              <div className="px-3 py-2.5">
                <p className="truncate text-xs font-semibold text-foreground/80">{item.title??"Karya"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {total > 24 && !loading && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}
            className="flex items-center gap-1.5 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/35 transition-all disabled:opacity-30 disabled:pointer-events-none">
            <ChevronLeft className="h-3.5 w-3.5"/> Sebelumnya
          </button>
          <span className="text-sm text-muted-foreground/40">{page} / {Math.ceil(total/24)}</span>
          <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(total/24)}
            className="flex items-center gap-1.5 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/35 transition-all disabled:opacity-30 disabled:pointer-events-none">
            Berikutnya <ChevronRight className="h-3.5 w-3.5"/>
          </button>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          item={lightbox}
          items={items}
          onClose={()=>setLightbox(null)}
          onPrev={()=>lbIdx>0&&setLightbox(items[lbIdx-1])}
          onNext={()=>lbIdx<items.length-1&&setLightbox(items[lbIdx+1])}
        />
      )}

      {/* ── Upload Modal ── */}
      {showUpload && <UploadModal onClose={()=>{setShowUpload(false);fetchGallery(activeFilter,search,page);}}/>}
    </div>
  );
}
