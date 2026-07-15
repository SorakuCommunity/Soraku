'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, AlertCircle, Home, User, LogOut, CheckCircle2 } from 'lucide-react'
import { DiscordIcon, GoogleIcon } from '@/components/icons/custom-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-destructive">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function FieldOk({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function AlreadyLoggedIn({ displayname, onLogout }: { displayname: string; onLogout: () => void }) {
  return (
    <div className="relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-1 text-xl font-black text-foreground">Kamu sudah login</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Halo, <span className="font-semibold text-foreground">{displayname}</span>! Mau ngapain?
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="h-4 w-4" /> Kembali ke Beranda
              </Link>
            </Button>
            <Button asChild>
              <Link href="/settings">
                <User className="h-4 w-4" /> Lihat Profil Saya
              </Link>
            </Button>
            <Button variant="destructive" onClick={onLogout}>
              <LogOut className="h-4 w-4" /> Keluar dari Akun
            </Button>
          </div>
        </CardContent>
      </Card>
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
        router.push('/settings')
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
      <div className="relative hidden flex-1 border-r border-border bg-muted/40 lg:flex lg:flex-col lg:justify-between">
        <div className="relative flex flex-1 items-center justify-center p-12">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-8 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
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
                <div key={s.label} className="rounded-lg border border-border bg-card p-3 text-center">
                  <p className="text-base font-black text-foreground">{s.value}</p>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border p-8">
          <p className="text-sm leading-relaxed italic text-muted-foreground/70">
            &ldquo;Komunitas yang hangat untuk semua pecinta budaya pop Jepang di Indonesia.&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground/40">- Soraku</p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:max-w-[480px]">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="overflow-hidden rounded-lg border border-border">
              <Image src="/logo.png" alt="Soraku" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-base leading-none font-black text-foreground">Soraku</p>
              <p className="text-xs text-muted-foreground/50">Community</p>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground">Selamat Datang Kembali</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Masuk ke akun Soraku Community kamu</p>

          {/* OAuth */}
          <div className="mt-6 flex flex-col gap-2.5">
            <Button asChild variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400">
              <a href="/api/auth/discord">
                <DiscordIcon className="h-5 w-5" /> Masuk dengan Discord
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/api/auth/google">
                <GoogleIcon className="h-5 w-5" /> Masuk dengan Google
              </a>
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground/40">atau email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {formError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Email
              </Label>
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
              <div className="mb-1.5 flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-primary/70 transition-colors hover:text-primary">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError('') }}
                  onBlur={() => { setTouched((p) => ({ ...p, password: true })); setPasswordErr(validatePassword(password)) }}
                  aria-invalid={touched.password && !!passwordErr}
                  className={cn(
                    'pr-11',
                    touched.password && passwordErr && 'border-destructive focus-visible:ring-destructive'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.password ? <FieldError msg={passwordErr} /> : null}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Masuk&hellip;</>
              ) : (
                <>Masuk <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
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
