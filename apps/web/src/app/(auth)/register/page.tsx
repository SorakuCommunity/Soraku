'use client'
import { trackTikTokRegistration } from '@/components/analytics/TikTokPixel'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { DiscordIcon, GoogleIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const BENEFITS = [
  { icon: '🎌', text: 'Akses ke semua konten komunitas' },
  { icon: '🗓️', text: 'Ikut event & gathering eksklusif' },
  { icon: '🖼️', text: 'Upload karya ke galeri komunitas' },
  { icon: '🏅', text: 'Badge & role member Soraku' },
]

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
    1: { label: 'Lemah', color: 'bg-red-500' },
    2: { label: 'Sedang', color: 'bg-yellow-500' },
    3: { label: 'Kuat', color: 'bg-green-500' },
  }
  return { score: score as 0 | 1 | 2 | 3, ...map[score] }
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-destructive">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />{msg}
    </p>
  )
}

function FieldOk({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />{msg}
    </p>
  )
}

function StrengthMeter({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', score >= i ? color : 'bg-muted')} />
        ))}
      </div>
      {label && (
        <p className={cn('text-[11px] font-bold', score === 1 ? 'text-red-400' : score === 2 ? 'text-yellow-400' : 'text-green-400')}>
          Keamanan: {label}
          {score === 1 && ' - tambah angka atau huruf kapital'}
          {score === 2 && ' - tambah simbol untuk lebih aman'}
        </p>
      )}
    </div>
  )
}

type AvailStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

function UsernameStatus({ status, username }: { status: AvailStatus; username: string }) {
  if (!username || status === 'idle') return null
  const color = status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-destructive'
  return (
    <p className={cn('mt-1.5 flex items-center gap-1.5 text-[11px] font-bold', color)}>
      {status === 'checking' && <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />}
      {status === 'available' && <CheckCircle2 className="h-3 w-3 flex-shrink-0" />}
      {(status === 'taken' || status === 'invalid') && <XCircle className="h-3 w-3 flex-shrink-0" />}
      {status === 'checking' ? 'Mengecek ketersediaan…'
        : status === 'available' ? 'Username tersedia!'
        : status === 'taken' ? 'Username sudah dipakai'
        : 'Hanya huruf kecil, angka, underscore'}
    </p>
  )
}

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
  const [touched, setTouched] = useState({ email: false, password: false, confirm: false, username: false })
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [confirmErr, setConfirmErr] = useState('')
  const [availStatus, setAvailStatus] = useState<AvailStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    !v.trim() ? 'Username wajib diisi'
    : v.length < 3 ? 'Username minimal 3 karakter'
    : v.length > 30 ? 'Username maksimal 30 karakter'
    : !isValidUsername(v) ? 'Hanya huruf kecil, angka, underscore' : ''

  useEffect(() => { if (touched.email) setEmailErr(validateEmail(email)) }, [email, touched.email])
  useEffect(() => { if (touched.password) setPasswordErr(validatePassword(password)) }, [password, touched.password])
  useEffect(() => { if (touched.confirm) setConfirmErr(validateConfirm(confirm, password)) }, [confirm, password, touched.confirm])

  useEffect(() => {
    if (!username) { setAvailStatus('idle'); return }
    const formatErr = validateUsername(username)
    if (formatErr) { setAvailStatus('invalid'); return }
    setAvailStatus('checking')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        setAvailStatus(res.ok && data.data?.available ? 'available' : 'taken')
      } catch { setAvailStatus('idle') }
    }, 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [username])

  const handleStep1 = () => {
    setTouched((p) => ({ ...p, email: true, password: true, confirm: true }))
    const eErr = validateEmail(email); const pErr = validatePassword(password); const cErr = validateConfirm(confirm, password)
    setEmailErr(eErr); setPasswordErr(pErr); setConfirmErr(cErr)
    if (eErr || pErr || cErr) return
    setFormError(''); setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { handleStep1(); return }
    setTouched((p) => ({ ...p, username: true }))
    const uErr = validateUsername(username)
    if (uErr) return
    if (availStatus === 'taken' || availStatus === 'invalid') return
    if (availStatus === 'checking') { setFormError('Menunggu cek username selesai…'); return }
    setFormError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username: username.toLowerCase(), ...(displayname.trim() ? { displayname: displayname.trim() } : {}) }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setFormError(data.error ?? 'Pendaftaran gagal. Coba lagi.'); return }
      trackTikTokRegistration()
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (loginRes.ok) { router.push('/settings'); router.refresh() }
      else { router.push('/login?registered=1') }
    } catch { setFormError('Gagal terhubung ke server. Coba lagi.') }
    finally { setLoading(false) }
  }

  const canStep1 = !emailErr && !passwordErr && !confirmErr && email && password && confirm
  const canStep2 = availStatus === 'available' && username

  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] items-stretch">
      {/* Left: Benefits */}
      <div className="relative hidden flex-1 border-r border-border bg-muted/40 lg:flex lg:flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="overflow-hidden rounded-lg border border-border">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="object-cover" />
            </div>
            <span className="text-base font-black text-foreground">Soraku</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Community</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-center p-8">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary/60">Bergabung Sekarang</p>
          <h2 className="text-2xl leading-tight font-black tracking-tight text-foreground">
            Komunitas anime<br />& budaya Jepang<br />terbesar di Indonesia
          </h2>
          <ul className="mt-8 space-y-3.5">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-sm">
                  {b.icon}
                </span>
                <span className="text-sm text-muted-foreground">{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-lg font-black text-primary">空</div>
            <div>
              <p className="text-sm font-bold text-foreground">Gratis selamanya</p>
              <p className="text-xs text-muted-foreground/60">Non-profit · Est. 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="w-full max-w-sm">
          {/* Step indicator */}
          <div className="mb-8 flex items-center gap-2">
            {['Akun', 'Profil'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn('flex h-6 w-6 items-center justify-center rounded-md border text-[11px] font-black transition-all',
                  step > i + 1
                    ? 'border-green-500 bg-green-500 text-white'
                    : step === i + 1
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground/50'
                )}>
                  {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn('text-xs font-bold', step === i + 1 ? 'text-foreground' : 'text-muted-foreground/50')}>
                  {s}
                </span>
                {i === 0 && <div className="mx-1 h-px w-8 bg-border" />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {step === 1 ? 'Buat Akun Baru' : 'Lengkapi Profil'}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {step === 1 ? 'Daftar ke Soraku - gratis!' : 'Username unikmu di komunitas Soraku'}
          </p>

          {/* OAuth - step 1 only */}
          {step === 1 && (
            <>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button asChild variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400">
                  <a href="/api/auth/discord">
                    <DiscordIcon className="h-5 w-5" /> Daftar dengan Discord
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/auth/google">
                    <GoogleIcon className="h-5 w-5" /> Daftar dengan Google
                  </a>
                </Button>
              </div>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground/40">atau email</span>
                <div className="flex-1 border-t border-border" />
              </div>
            </>
          )}

          {formError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="kamu@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormError('') }}
                    onBlur={() => { setTouched((p) => ({ ...p, email: true })); setEmailErr(validateEmail(email)) }}
                    aria-invalid={touched.email && !!emailErr}
                    className={cn(
                      touched.email && emailErr && 'border-destructive focus-visible:ring-destructive',
                      touched.email && !emailErr && email && 'border-green-500/50'
                    )}
                  />
                  {touched.email ? <FieldError msg={emailErr} /> : null}
                  {touched.email && !emailErr && email ? <FieldOk msg="Email valid" /> : null}
                </div>

                <div>
                  <Label htmlFor="password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min 8 karakter"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setFormError('') }}
                      onBlur={() => { setTouched((p) => ({ ...p, password: true })); setPasswordErr(validatePassword(password)) }}
                      aria-invalid={touched.password && !!passwordErr}
                      className={cn(
                        'pr-11',
                        touched.password && passwordErr && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                    <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-muted-foreground" aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}>
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <StrengthMeter password={password} />
                </div>

                <div>
                  <Label htmlFor="confirm" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Ulangi password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setFormError('') }}
                      onBlur={() => { setTouched((p) => ({ ...p, confirm: true })); setConfirmErr(validateConfirm(confirm, password)) }}
                      aria-invalid={touched.confirm && !!confirmErr}
                      className={cn(
                        'pr-11',
                        touched.confirm && confirmErr && 'border-destructive focus-visible:ring-destructive',
                        touched.confirm && !confirmErr && confirm && 'border-green-500/50'
                      )}
                    />
                    <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-muted-foreground" aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}>
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {touched.confirm ? <FieldError msg={confirmErr} /> : null}
                  {touched.confirm && !confirmErr && confirm ? <FieldOk msg="Password cocok" /> : null}
                </div>

                <Button type="submit" disabled={!canStep1} className="w-full">
                  Lanjut <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="username" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Username</Label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground/40">@</span>
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      placeholder="contoh: anon_weebs"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); setFormError('') }}
                      onBlur={() => setTouched((p) => ({ ...p, username: true }))}
                      aria-invalid={touched.username && !!validateUsername(username)}
                      className={cn(
                        'pl-8',
                        touched.username && validateUsername(username) && 'border-destructive focus-visible:ring-destructive'
                      )}
                    />
                  </div>
                  <UsernameStatus status={availStatus} username={username} />
                  <p className="mt-1 text-[11px] text-muted-foreground/35">Huruf kecil, angka, underscore. Tidak bisa diubah setelah daftar.</p>
                </div>

                <div>
                  <Label htmlFor="displayname" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Nama Tampilan <span className="font-normal normal-case text-muted-foreground/30">(opsional)</span>
                  </Label>
                  <Input
                    id="displayname"
                    type="text"
                    placeholder="Nama yang tampil ke orang lain"
                    value={displayname}
                    onChange={(e) => setDisplayname(e.target.value.slice(0, 50))}
                  />
                  {displayname && (
                    <p className="mt-1 text-right text-[11px] tabular-nums text-muted-foreground/30">{displayname.length}/50</p>
                  )}
                </div>

                {/* Summary */}
                <div className="divide-y divide-border rounded-lg border border-border bg-muted/40">
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground/40">Email</span>
                    <span className="max-w-[180px] truncate text-xs font-medium text-foreground/70">{email}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground/40">Password</span>
                    <span className="text-xs text-muted-foreground/40">{'•'.repeat(Math.min(password.length, 10))}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setStep(1); setFormError('') }}>
                    ← Kembali
                  </Button>
                  <Button type="submit" disabled={loading || !canStep2} className="flex-1">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Mendaftar&hellip;</>
                    ) : (
                      <>Daftar Sekarang <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground/50">
              Dengan mendaftar kamu setuju dengan{' '}
              <Link href="/terms" className="font-bold text-primary/70 hover:text-primary">Syarat & Ketentuan</Link>{' '}
              dan{' '}
              <Link href="/privacy" className="font-bold text-primary/70 hover:text-primary">Kebijakan Privasi</Link>{' '}
              Soraku.
            </p>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
