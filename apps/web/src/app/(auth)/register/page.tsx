'use client'
import { trackTikTokRegistration } from '@/components/analytics/TikTokPixel'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react'
import { DiscordIcon, GoogleIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: '🎌', text: 'Akses ke semua konten komunitas' },
  { icon: '🗓️', text: 'Ikut event & gathering eksklusif' },
  { icon: '🖼️', text: 'Upload karya ke galeri komunitas' },
  { icon: '🏅', text: 'Badge & role member Soraku' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isValidUsername = (v: string) => /^[a-z0-9_]+$/.test(v)

function getPasswordStrength(p: string): { score: 0 | 1 | 2 | 3; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '' }
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score = Math.min(3, score + 1) as 0 | 1 | 2 | 3
  const map: Record<number, { label: string; color: string }> = {
    0: { label: '', color: '' },
    1: { label: 'Lemah', color: 'bg-destructive' },
    2: { label: 'Sedang', color: 'bg-yellow-500' },
    3: { label: 'Kuat', color: 'bg-green-500' },
  }
  return { score: score as 0 | 1 | 2 | 3, ...map[score] }
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="text-destructive animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1.5 text-[11px] font-medium duration-150">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}
function FieldOk({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="animate-in fade-in mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-green-400 duration-150">
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function InputField({
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  error,
  ok: okMsg,
  suffix,
  disabled,
  prefix,
}: {
  type?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  autoComplete?: string
  error?: string
  ok?: string
  suffix?: React.ReactNode
  prefix?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div>
      <div className="relative">
        {prefix && <div className="absolute top-1/2 left-4 -translate-y-1/2">{prefix}</div>}
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            'bg-card/50 w-full rounded-xl border py-3 text-sm outline-none',
            'placeholder:text-muted-foreground/40 transition-all duration-150 focus:ring-1',
            prefix ? 'pl-8' : 'pl-4',
            suffix ? 'pr-11' : 'pr-4',
            disabled && 'cursor-not-allowed opacity-60',
            error
              ? 'border-destructive/60 focus:border-destructive/70 focus:ring-destructive/15'
              : okMsg
                ? 'border-green-500/40 focus:border-green-500/50 focus:ring-green-500/10'
                : 'border-border focus:border-primary/50 focus:ring-primary/20'
          )}
        />
        {suffix && <div className="absolute top-1/2 right-3 -translate-y-1/2">{suffix}</div>}
      </div>
      {error ? <FieldError msg={error} /> : okMsg ? <FieldOk msg={okMsg} /> : null}
    </div>
  )
}

// ── Password Strength Meter ───────────────────────────────────────────────────
function StrengthMeter({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <div className="animate-in fade-in mt-2 space-y-1.5 duration-200">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              score >= i ? color : 'bg-border/50'
            )}
          />
        ))}
      </div>
      {label && (
        <p
          className={cn('text-[11px] font-medium', {
            'text-destructive': score === 1,
            'text-yellow-400': score === 2,
            'text-green-400': score === 3,
          })}
        >
          Keamanan: {label}
          {score === 1 && ' — tambah angka atau huruf kapital'}
          {score === 2 && ' — tambah simbol untuk lebih aman'}
        </p>
      )}
    </div>
  )
}

// ── Username Availability Status ──────────────────────────────────────────────
type AvailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

function UsernameStatus({ status, username }: { status: AvailStatus; username: string }) {
  if (!username || status === 'idle') return null
  return (
    <p
      className={cn(
        'animate-in fade-in mt-1.5 flex items-center gap-1.5 text-[11px] font-medium duration-150',
        status === 'available'
          ? 'text-green-400'
          : status === 'taken' || status === 'invalid'
            ? 'text-destructive'
            : 'text-muted-foreground/50'
      )}
    >
      {status === 'checking' && <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />}
      {status === 'available' && <CheckCircle2 className="h-3 w-3 flex-shrink-0" />}
      {(status === 'taken' || status === 'invalid') && (
        <XCircle className="h-3 w-3 flex-shrink-0" />
      )}
      {status === 'checking'
        ? 'Mengecek ketersediaan…'
        : status === 'available'
          ? 'Username tersedia!'
          : status === 'taken'
            ? 'Username sudah dipakai'
            : 'Hanya huruf kecil, angka, underscore'}
    </p>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter()

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [username, setUsername] = useState('')
  const [displayname, setDisplayname] = useState('')

  // Touched state
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
    username: false,
  })

  // Per-field errors
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [confirmErr, setConfirmErr] = useState('')

  // Username availability
  const [availStatus, setAvailStatus] = useState<AvailStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Validators ──
  const validateEmail = (v: string) =>
    !v.trim() ? 'Email wajib diisi' : !isValidEmail(v) ? 'Format email tidak valid' : ''
  const validatePassword = (v: string) => {
    if (!v) return 'Password wajib diisi'
    if (v.length < 8) return 'Password minimal 8 karakter'
    return ''
  }
  const validateConfirm = (v: string, p: string) =>
    !v ? 'Konfirmasi password wajib diisi' : v !== p ? 'Password tidak cocok' : ''
  const validateUsername = (v: string) =>
    !v.trim()
      ? 'Username wajib diisi'
      : v.length < 3
        ? 'Username minimal 3 karakter'
        : v.length > 30
          ? 'Username maksimal 30 karakter'
          : !isValidUsername(v)
            ? 'Hanya huruf kecil, angka, underscore'
            : ''

  // ── Live validation ──
  useEffect(() => {
    if (touched.email) setEmailErr(validateEmail(email))
  }, [email, touched.email])
  useEffect(() => {
    if (touched.password) setPasswordErr(validatePassword(password))
  }, [password, touched.password])
  useEffect(() => {
    if (touched.confirm) setConfirmErr(validateConfirm(confirm, password))
  }, [confirm, password, touched.confirm])

  // ── Username availability check (debounce 600ms) ──
  useEffect(() => {
    if (!username) {
      setAvailStatus('idle')
      return
    }
    const formatErr = validateUsername(username)
    if (formatErr) {
      setAvailStatus('invalid')
      return
    }

    setAvailStatus('checking')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        setAvailStatus(res.ok && data.data?.available ? 'available' : 'taken')
      } catch {
        setAvailStatus('idle')
      }
    }, 600)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [username])

  // ── Step 1 submit (validasi & next) ──
  const handleStep1 = () => {
    setTouched((p) => ({ ...p, email: true, password: true, confirm: true }))
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    const cErr = validateConfirm(confirm, password)
    setEmailErr(eErr)
    setPasswordErr(pErr)
    setConfirmErr(cErr)
    if (eErr || pErr || cErr) return
    setFormError('')
    setStep(2)
  }

  // ── Step 2 submit (register) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      handleStep1()
      return
    }

    setTouched((p) => ({ ...p, username: true }))
    const uErr = validateUsername(username)
    if (uErr) return
    if (availStatus === 'taken' || availStatus === 'invalid') return
    if (availStatus === 'checking') {
      setFormError('Menunggu cek username selesai…')
      return
    }

    setFormError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          username: username.toLowerCase(),
          ...(displayname.trim() ? { displayname: displayname.trim() } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setFormError(data.error ?? 'Pendaftaran gagal. Coba lagi.')
        return
      }

      trackTikTokRegistration()
      // Auto-login setelah register
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (loginRes.ok) {
        router.push('/profile/me')
        router.refresh()
      } else {
        router.push('/login?registered=1')
      }
    } catch {
      setFormError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const canStep1 = !emailErr && !passwordErr && !confirmErr && email && password && confirm
  const canStep2 = availStatus === 'available' && username

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-stretch">
      {/* Kiri: Benefits */}
      <div className="from-accent/8 via-background to-background border-border/40 relative hidden flex-1 overflow-hidden border-r bg-gradient-to-br lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-blob bg-accent/10 absolute -top-20 -right-20 h-80 w-80 rounded-full blur-[120px]" />
          <div className="animate-blob animation-delay-3000 bg-primary/8 absolute bottom-10 left-0 h-72 w-72 rounded-full blur-[100px]" />
        </div>
        <div className="relative p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="border-border/60 h-10 w-10 overflow-hidden rounded-xl border">
              <Image
                src="/logo.png"
                alt="Soraku"
                width={40}
                height={40}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <span className="text-base font-black">Soraku</span>
            <span className="text-muted-foreground/40 text-xs tracking-widest uppercase">
              Community
            </span>
          </Link>
        </div>
        <div className="relative flex flex-1 flex-col justify-center p-8">
          <p className="text-primary/60 mb-2 text-xs font-bold tracking-widest uppercase">
            Bergabung Sekarang
          </p>
          <h2 className="text-2xl leading-tight font-black tracking-tight">
            Komunitas anime
            <br />& budaya Jepang
            <br />
            terbesar di Indonesia
          </h2>
          <ul className="mt-8 space-y-3.5">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="bg-primary/15 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-sm">
                  {b.icon}
                </span>
                <span className="text-muted-foreground text-sm">{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="border-border/40 bg-card/40 mt-8 flex items-center gap-3 rounded-2xl border p-4">
            <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black">
              空
            </div>
            <div>
              <p className="text-sm font-semibold">Gratis selamanya</p>
              <p className="text-muted-foreground/60 text-xs">Non-profit · Est. 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanan: Form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="animate-blob bg-accent/7 absolute -top-16 left-0 h-64 w-64 rounded-full blur-3xl" />
          <div className="animate-blob animation-delay-2000 bg-primary/5 absolute right-0 bottom-0 h-56 w-56 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-2">
            {['Akun', 'Profil'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black transition-all',
                    step > i + 1
                      ? 'bg-green-500 text-white'
                      : step === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-muted/60 text-muted-foreground/50'
                  )}
                >
                  {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold',
                    step === i + 1 ? 'text-foreground' : 'text-muted-foreground/50'
                  )}
                >
                  {s}
                </span>
                {i === 0 && <div className="bg-border/60 mx-1 h-px w-8" />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            {step === 1 ? 'Buat Akun Baru' : 'Lengkapi Profil'}
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            {step === 1
              ? 'Daftar ke Soraku — gratis!'
              : 'Username unikmu di komunitas Soraku'}
          </p>

          {/* OAuth — hanya step 1 */}
          {step === 1 && (
            <>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="/api/auth/discord"
                  className="flex items-center justify-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/8 px-4 py-3 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5 hover:border-indigo-400/50 hover:bg-indigo-500/15"
                >
                  <DiscordIcon className="h-5 w-5" />
                  Daftar dengan Discord
                </a>
                <a
                  href="/api/auth/google"
                  className="border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all hover:-translate-y-0.5"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Daftar dengan Google
                </a>
              </div>
              <div className="my-5 flex items-center gap-3">
                <div className="border-border/50 flex-1 border-t" />
                <span className="text-muted-foreground/40 text-xs font-medium">atau email</span>
                <div className="border-border/50 flex-1 border-t" />
              </div>
            </>
          )}

          {/* Form-level error */}
          {formError && (
            <div className="border-destructive/30 bg-destructive/8 animate-in fade-in slide-in-from-top-2 mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 duration-200">
              <AlertCircle className="text-destructive mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-destructive text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {step === 1 ? (
              <>
                {/* Email */}
                <div>
                  <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                    Email
                  </label>
                  <InputField
                    type="email"
                    autoComplete="email"
                    placeholder="kamu@example.com"
                    value={email}
                    onChange={(v) => {
                      setEmail(v)
                      setFormError('')
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, email: true }))
                      setEmailErr(validateEmail(email))
                    }}
                    error={touched.email ? emailErr : undefined}
                    ok={touched.email && !emailErr && email ? 'Email valid' : undefined}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                    Password
                  </label>
                  <InputField
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min 8 karakter"
                    value={password}
                    onChange={(v) => {
                      setPassword(v)
                      setFormError('')
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, password: true }))
                      setPasswordErr(validatePassword(password))
                    }}
                    error={touched.password ? passwordErr : undefined}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  <StrengthMeter password={password} />
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                    Konfirmasi Password
                  </label>
                  <InputField
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    value={confirm}
                    onChange={(v) => {
                      setConfirm(v)
                      setFormError('')
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, confirm: true }))
                      setConfirmErr(validateConfirm(confirm, password))
                    }}
                    error={touched.confirm ? confirmErr : undefined}
                    ok={touched.confirm && !confirmErr && confirm ? 'Password cocok' : undefined}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canStep1}
                  className={cn(
                    'shadow-primary/20 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all',
                    canStep1
                      ? 'bg-primary hover:-translate-y-0.5'
                      : 'bg-primary/50 cursor-not-allowed'
                  )}
                >
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                {/* Username */}
                <div>
                  <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                    Username
                  </label>
                  <InputField
                    type="text"
                    autoComplete="username"
                    placeholder="contoh: anon_weebs"
                    value={username}
                    onChange={(v) => {
                      setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                      setFormError('')
                    }}
                    onBlur={() => setTouched((p) => ({ ...p, username: true }))}
                    error={
                      touched.username && validateUsername(username)
                        ? validateUsername(username)
                        : undefined
                    }
                    ok={availStatus === 'available' ? undefined : undefined}
                    prefix={<span className="text-muted-foreground/40 text-sm font-medium">@</span>}
                  />
                  <UsernameStatus status={availStatus} username={username} />
                  <p className="text-muted-foreground/35 mt-1 text-[11px]">
                    Huruf kecil, angka, underscore. Tidak bisa diubah setelah daftar.
                  </p>
                </div>

                {/* Nama tampilan */}
                <div>
                  <label className="text-muted-foreground/60 mb-1.5 block text-xs font-semibold tracking-widest uppercase">
                    Nama Tampilan{' '}
                    <span className="text-muted-foreground/30 normal-case">(opsional)</span>
                  </label>
                  <InputField
                    type="text"
                    placeholder="Nama yang tampil ke orang lain"
                    value={displayname}
                    onChange={(v) => setDisplayname(v.slice(0, 50))}
                  />
                  {displayname && (
                    <p className="text-muted-foreground/30 mt-1 text-right text-[11px] tabular-nums">
                      {displayname.length}/50
                    </p>
                  )}
                </div>

                {/* Summary akun */}
                <div className="border-border/30 bg-muted/10 divide-border/20 divide-y rounded-xl border">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-muted-foreground/40 text-xs">Email</span>
                    <span className="text-foreground/70 max-w-[180px] truncate text-xs font-medium">
                      {email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-muted-foreground/40 text-xs">Password</span>
                    <span className="text-muted-foreground/40 text-xs">
                      {'•'.repeat(Math.min(password.length, 10))}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setFormError('')
                    }}
                    className="border-border/50 text-muted-foreground hover:border-border hover:text-foreground flex items-center gap-1.5 rounded-xl border px-4 py-3 text-xs font-medium transition-all"
                  >
                    ← Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !canStep2}
                    className={cn(
                      'shadow-primary/20 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all',
                      !loading && canStep2
                        ? 'bg-primary hover:-translate-y-0.5'
                        : 'bg-primary/50 cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mendaftar…
                      </>
                    ) : (
                      <>
                        Daftar Sekarang
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <p className="text-muted-foreground/50 mt-5 text-center text-xs leading-relaxed">
              Dengan mendaftar kamu setuju dengan{' '}
              <Link href="/terms" className="text-primary/70 hover:text-primary">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link href="/privacy" className="text-primary/70 hover:text-primary">
                Kebijakan Privasi
              </Link>{' '}
              Soraku.
            </p>
          )}
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
