"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowRight, AlertCircle, Home, User, LogOut, CheckCircle2 } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@/components/icons/custom-icons";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── Sub-components ─────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />{msg}
    </p>
  );
}
function FieldOk({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-green-400 animate-in fade-in duration-150">
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />{msg}
    </p>
  );
}

function InputField({
  type = "text", value, onChange, onBlur, placeholder, autoComplete,
  error, ok: okMsg, suffix, disabled,
}: {
  type?: string; value: string;
  onChange: (v: string) => void; onBlur?: () => void;
  placeholder?: string; autoComplete?: string;
  error?: string; ok?: string;
  suffix?: React.ReactNode; disabled?: boolean;
}) {
  return (
    <div>
      <div className="relative">
        <input
          type={type} value={value} disabled={disabled}
          onChange={e => onChange(e.target.value)} onBlur={onBlur}
          placeholder={placeholder} autoComplete={autoComplete}
          className={cn(
            "w-full rounded-xl border bg-card/50 px-4 py-3 text-sm outline-none",
            "placeholder:text-muted-foreground/40 transition-all duration-150 focus:ring-1",
            suffix ? "pr-11" : "",
            disabled && "opacity-60 cursor-not-allowed",
            error  ? "border-destructive/60 focus:border-destructive/70 focus:ring-destructive/15"
            : okMsg ? "border-green-500/40 focus:border-green-500/50 focus:ring-green-500/10"
            :         "border-border focus:border-primary/50 focus:ring-primary/20"
          )}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error ? <FieldError msg={error} /> : okMsg ? <FieldOk msg={okMsg} /> : null}
    </div>
  );
}

// ── Already logged-in screen ──────────────────────────────────────────────────
function AlreadyLoggedIn({ displayname, onLogout }: { displayname: string; onLogout: () => void }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm rounded-2xl p-8 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <User className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-black mb-1">Kamu sudah login</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Halo, <span className="font-semibold text-foreground">{displayname}</span>! Mau ngapain?
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-border/60 px-4 py-3 text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all">
            <Home className="h-4 w-4" />Kembali ke Beranda
          </Link>
          <Link href="/profile/me"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
            <User className="h-4 w-4" />Lihat Profil Saya
          </Link>
          <button onClick={onLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="h-4 w-4" />Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function LoginPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [showPass,     setShowPass]     = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [formError,    setFormError]    = useState(() => {
    // Tampilkan error dari OAuth callback (redirect dari middleware)
    const e = searchParams.get("error");
    if (!e) return "";
    const decoded = decodeURIComponent(e);
    if (decoded.includes("state")) return "Sesi login kedaluwarsa. Silakan coba login lagi.";
    if (decoded.includes("invalid_request")) return "Permintaan OAuth tidak valid. Gunakan tombol login Discord di bawah.";
    return decoded.replace(/\+/g, " ");
  });
  const [loggedIn,     setLoggedIn]     = useState<{ displayname: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [touched,  setTouched]  = useState({ email: false, password: false });
  const [emailErr,    setEmailErr]    = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json())
      .then(d => { if (d.data?.id) setLoggedIn({ displayname: d.data.displayname ?? d.data.username ?? "Kamu" }); })
      .catch(() => {}).finally(() => setCheckingAuth(false));
  }, []);

  const validateEmail    = (v: string) => !v.trim() ? "Email wajib diisi" : !isValidEmail(v) ? "Format email tidak valid" : "";
  const validatePassword = (v: string) => !v ? "Password wajib diisi" : "";

  useEffect(() => { if (touched.email)    setEmailErr(validateEmail(email));       }, [email, touched.email]);
  useEffect(() => { if (touched.password) setPasswordErr(validatePassword(password)); }, [password, touched.password]);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
    setLoggedIn(null);
    router.refresh();
  };

  if (checkingAuth) return null;
  if (loggedIn) return <AlreadyLoggedIn displayname={loggedIn.displayname} onLogout={handleLogout} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailErr(eErr); setPasswordErr(pErr);
    if (eErr || pErr) return;
    setFormError(""); setLoading(true);
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setFormError(data.error ?? "Email atau password salah."); }
      else { router.push("/profile/me"); router.refresh(); }
    } catch {
      setFormError("Gagal terhubung ke server. Coba lagi.");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-stretch">
      {/* Visual panel */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex lg:flex-col lg:justify-between bg-gradient-to-br from-primary/12 via-background to-background/95 border-r border-border/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/12 blur-[120px]" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[100px]" />
        </div>
        <div className="relative flex flex-1 items-center justify-center p-12">
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-3xl bg-primary/6 blur-2xl" />
            <div className="glass-card relative h-[380px] w-[300px] overflow-hidden rounded-[2rem] p-0">
              <Image src="/logo-full.png" alt="Soraku mascot" fill className="object-cover object-top" priority />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-5 pt-10">
                <p className="text-base font-black">Soraku Community</p>
                <p className="text-xs text-muted-foreground/60">空 · Indonesia · Est. 2023</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative p-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground/70 italic leading-relaxed">
            "Komunitas yang hangat untuk semua pecinta budaya pop Jepang di Indonesia."
          </p>
          <p className="mt-2 text-xs text-muted-foreground/40">— Soraku Community</p>
        </div>
      </div>

      {/* Form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="animate-blob absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/7 blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-border/60">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <p className="text-base font-black leading-none">Soraku</p>
              <p className="text-xs text-muted-foreground/50">Community</p>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight">Selamat Datang Kembali</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Masuk ke akun Soraku Community kamu</p>

          {/* OAuth */}
          <div className="mt-6 flex flex-col gap-2.5">
            <a href="/api/auth/discord"
              className="flex items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-semibold text-indigo-300 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/15 hover:-translate-y-0.5">
              <DiscordIcon className="h-5 w-5" />Masuk dengan Discord
            </a>
            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5">
              <GoogleIcon className="h-5 w-5" />Masuk dengan Google
            </a>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-border/50" />
            <span className="text-xs text-muted-foreground/40 font-medium">atau email</span>
            <div className="flex-1 border-t border-border/50" />
          </div>

          {/* Form-level error */}
          {formError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Email</label>
              <InputField type="email" autoComplete="email" placeholder="kamu@example.com"
                value={email}
                onChange={v => { setEmail(v); setFormError(""); }}
                onBlur={() => { setTouched(p => ({ ...p, email: true })); setEmailErr(validateEmail(email)); }}
                error={touched.email ? emailErr : undefined}
                ok={touched.email && !emailErr && email ? "Email valid" : undefined}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary/70 hover:text-primary transition-colors">Lupa password?</Link>
              </div>
              <InputField
                type={showPass ? "text" : "password"} autoComplete="current-password"
                placeholder="Masukkan password kamu"
                value={password}
                onChange={v => { setPassword(v); setFormError(""); }}
                onBlur={() => { setTouched(p => ({ ...p, password: true })); setPasswordErr(validatePassword(password)); }}
                error={touched.password ? passwordErr : undefined}
                suffix={
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none">
              {loading
                ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Masuk…</>
                : <>Masuk<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
