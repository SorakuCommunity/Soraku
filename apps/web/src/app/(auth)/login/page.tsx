'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, AlertCircle, Home, User, LogOut, CheckCircle2 } from 'lucide-react'
import { DiscordIcon, GoogleIcon } from '@/components/icons/custom-icons'

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function FieldOk({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-green-400">
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function InputField({
  type = 'text', value, onChange, onBlur, placeholder, autoComplete, error, ok: okMsg, suffix, disabled,
}: {
  type?: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  placeholder?: string; autoComplete?: string; error?: string; ok?: string
  suffix?: React.ReactNode; disabled?: boolean
}) {
  const borderColor = error
    ? 'border-red-500/40 focus:border-red-500'
    : okMsg
      ? 'border-green-500/40 focus:border-green-500'
      : 'border-white/[0.12] focus:border-primary/40'
  return (
    <div>
      <div className="relative">
        <input
          type={type} value={value} disabled={disabled}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          placeholder={placeholder} autoComplete={autoComplete}
          className={`w-full rounded-sm border-2 bg-card px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/40 transition-all focus:shadow-[2px_2px_0px_rgba(37,99,235,0.2)] ${suffix ? 'pr-11' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${borderColor}`}
        />
        {suffix && <div className="absolute top-1/2 right-3 -translate-y-1/2">{suffix}</div>}
      </div>
      {error ? <FieldError msg={error} /> : okMsg ? <FieldOk msg={okMsg} /> : null}
    </div>
  )
}

function AlreadyLoggedIn({ displayname, onLogout }: { displayname: string; onLogout: () => void }) {
  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-md border-2 border-white/[0.07] bg-card p-8 text-center shadow-[4px_4px_0px_rgba(37,99,235,0.12)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md border-2 border-primary/20 bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-1 text-xl font-black text-foreground">Kamu sudah login</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Halo, <span className="text-foreground font-semibold">{displayname}</span>! Mau ngapain?
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center justify-center gap-2 rounded-sm border-2 border-white/[0.12] px-4 py-2.5 text-sm font-bold text-muted-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.08)] hover:border-primary/30 hover:text-foreground transition-all">
            <Home className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <Link href="/profile/me" className="flex items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all">
            <User className="h-4 w-4" /> Lihat Profil Saya
          </Link>
          <button onClick={onLogout} className="flex items-center justify-center gap-2 rounded-sm border-2 border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/15 transition-all">
            <LogOut className="h-4 w-4" /> Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(() => {
    const e = searchParams.get('error')
    if (!e) return ''
    const decoded = decodeURIComponent(e)
    if (decoded.includes('state')) return 'Sesi login kedaluwarsa. Silakan coba login lagi.'
    if (decoded.includes('invalid_request'))
      return 'Permintaan OAuth tidak valid. Gunakan tombol login Discord di bawah.'
    return decoded.replace(/\+/g, ' ')
  })
  const [loggedIn, setLoggedIn] = useState<{ displayname: string } | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.id) setLoggedIn({ displayname: d.data.displayname ?? d.data.username ?? 'Kamu' })
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false))
  }, [])

  const validateEmail = (v: string) =>
    !v.trim() ? 'Email wajib diisi' : !isValidEmail(v) ? 'Format email tidak valid' : ''
  const validatePassword = (v: string) => (!v ? 'Password wajib diisi' : '')

  useEffect(() => {
    if (touched.email) setEmailErr(validateEmail(email))
  }, [email, touched.email])
  useEffect(() => {
    if (touched.password) setPasswordErr(validatePassword(password))
  }, [password, touched.password])

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' }).catch(() => {})
    setLoggedIn(null)
    router.refresh()
  }

  if (checkingAuth) return null
  if (loggedIn) return <AlreadyLoggedIn displayname={loggedIn.displayname} onLogout={handleLogout} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailErr(eErr)
    setPasswordErr(pErr)
    if (eErr || pErr) return
    setFormError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setFormError(data.error ?? 'Email atau password salah.')
      } else {
        router.push('/profile/me')
        router.refresh()
      }
    } catch {
      setFormError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] items-stretch">
      {/* Left Panel: Community */}
      <div className="relative hidden flex-1 border-r-2 border-white/[0.06] bg-card lg:flex lg:flex-col lg:justify-between">
        <div className="relative flex flex-1 items-center justify-center p-12">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-md border-2 border-white/[0.07] bg-gradient-to-br from-primary/10 to-card shadow-[6px_6px_0px_rgba(37,99,235,0.15)]">
              <Image
                src="/logo-full.png"
                alt="Soraku mascot"
                width={256}
                height={256}
                className="object-cover object-top"
                priority
              />
            </div>
            <p className="text-2xl font-black text-foreground">Soraku</p>
            <p className="text-xs text-muted-foreground/60">空 · Indonesia · Est. 2023</p>
            <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-3">
              {[
                { label: 'Members', value: '12K+' },
                { label: 'Events', value: '50+' },
                { label: 'Karya', value: '200+' },
              ].map((s) => (
                <div key={s.label} className="rounded-sm border-2 border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <p className="text-base font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t-2 border-white/[0.06] p-8">
          <p className="text-sm leading-relaxed italic text-muted-foreground/70">
            &ldquo;Komunitas yang hangat untuk semua pecinta budaya pop Jepang di Indonesia.&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground/40">— Soraku</p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="overflow-hidden rounded-sm border-2 border-white/[0.12]">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-base leading-none font-black text-foreground">Soraku</p>
              <p className="text-xs text-muted-foreground/50">Community</p>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">Selamat Datang Kembali</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Masuk ke akun Soraku Community kamu</p>

          {/* OAuth */}
          <div className="mt-6 flex flex-col gap-2.5">
            <a href="/api/auth/discord"
              className="flex items-center justify-center gap-3 rounded-sm border-2 border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-bold text-indigo-400 shadow-[2px_2px_0px_rgba(99,102,241,0.2)] hover:bg-indigo-500/20 hover:shadow-[3px_3px_0px_rgba(99,102,241,0.3)] transition-all"
            >
              <DiscordIcon className="h-5 w-5" /> Masuk dengan Discord
            </a>
            <a href="/api/auth/google"
              className="flex items-center justify-center gap-3 rounded-sm border-2 border-white/[0.12] px-4 py-2.5 text-sm font-bold text-muted-foreground shadow-[2px_2px_0px_rgba(37,99,235,0.08)] hover:border-primary/30 hover:text-foreground hover:shadow-[3px_3px_0px_rgba(37,99,235,0.15)] transition-all"
            >
              <GoogleIcon className="h-5 w-5" /> Masuk dengan Google
            </a>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t-2 border-white/[0.06]" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground/40">atau email</span>
            <div className="flex-1 border-t-2 border-white/[0.06]" />
          </div>

          {formError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-sm border-2 border-red-500/30 bg-red-500/8 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <p className="text-sm text-red-400">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Email
              </label>
              <InputField type="email" autoComplete="email" placeholder="kamu@example.com"
                value={email}
                onChange={(v) => { setEmail(v); setFormError('') }}
                onBlur={() => { setTouched((p) => ({ ...p, email: true })); setEmailErr(validateEmail(email)) }}
                error={touched.email ? emailErr : undefined}
                ok={touched.email && !emailErr && email ? 'Email valid' : undefined}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-primary/70 hover:text-primary transition-colors">
                  Lupa password?
                </Link>
              </div>
              <InputField type={showPass ? 'text' : 'password'} autoComplete="current-password" placeholder="Masukkan password"
                value={password}
                onChange={(v) => { setPassword(v); setFormError('') }}
                onBlur={() => { setTouched((p) => ({ ...p, password: true })); setPasswordErr(validatePassword(password)) }}
                error={touched.password ? passwordErr : undefined}
                suffix={
                  <button type="button" onClick={() => setShowPass((p) => !p)} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-primary bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[3px_3px_0px_rgba(37,99,235,0.3)] hover:bg-primary/90 transition-all disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Masuk&hellip;</>
              ) : (
                <>Masuk <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <p className="text-muted-foreground mt-6 text-center text-sm">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-primary hover:underline">Daftar gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}
