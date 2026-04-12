'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COOKIE_KEY = 'soraku_cookie_consent'

interface CookieConsentData {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsentData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY)
    if (stored) {
      setConsent(JSON.parse(stored))
    } else {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const data: CookieConsentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data))
    setConsent(data)
    setShow(false)
  }

  const handleAcceptNecessary = () => {
    const data: CookieConsentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data))
    setConsent(data)
    setShow(false)
  }

  const handleSaveCustom = (necessary: boolean, analytics: boolean, marketing: boolean) => {
    const data: CookieConsentData = {
      necessary,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(COOKIE_KEY, JSON.stringify(data))
    setConsent(data)
    setShow(false)
    setShowSettings(false)
  }

  const openSettings = () => setShowSettings(true)

  if (!show || consent) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-4 bottom-4 z-50 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-[#4FA3D1]/30 bg-[#0A0A0C]/95 p-5 shadow-2xl shadow-[#4FA3D1]/10 backdrop-blur-xl">
          {!showSettings ? (
            <>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4FA3D1]/20">
                  <Cookie className="h-5 w-5 text-[#4FA3D1]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white"> Cookie Preferences</h3>
                  <p className="text-xs text-[#6E8FA6]">We value your privacy</p>
                </div>
              </div>

              <p className="mb-4 text-sm text-[#D9DDE3]/70">
                Soraku uses cookies to enhance your experience. You can choose which cookies you
                want to allow.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-[#4FA3D1] text-sm text-white hover:bg-[#4FA3D1]/80"
                >
                  Accept All
                </Button>
                <Button
                  onClick={openSettings}
                  variant="outline"
                  className="flex-1 border-[#6E8FA6] text-sm text-[#D9DDE3] hover:bg-[#6E8FA6]/10"
                >
                  Customize
                </Button>
              </div>

              <button
                onClick={handleAcceptNecessary}
                className="mt-2 w-full text-xs text-[#6E8FA6] underline hover:text-[#D9DDE3]"
              >
                Only necessary cookies
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Cookie Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[#6E8FA6] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4 space-y-3">
                <label className="flex cursor-not-allowed items-center justify-between opacity-50">
                  <span className="text-sm text-[#D9DDE3]">Necessary</span>
                  <input type="checkbox" checked disabled className="h-4 w-4 accent-[#4FA3D1]" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-[#D9DDE3]">Analytics</span>
                  <input type="checkbox" id="analytics" className="h-4 w-4 accent-[#4FA3D1]" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-[#D9DDE3]">Marketing</span>
                  <input type="checkbox" id="marketing" className="h-4 w-4 accent-[#4FA3D1]" />
                </label>
              </div>

              <Button
                onClick={() => {
                  const analytics =
                    (document.getElementById('analytics') as HTMLInputElement)?.checked || false
                  const marketing =
                    (document.getElementById('marketing') as HTMLInputElement)?.checked || false
                  handleSaveCustom(true, analytics, marketing)
                }}
                className="w-full bg-[#4FA3D1] text-white hover:bg-[#4FA3D1]/80"
              >
                Save Preferences
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function getCookieConsent(): CookieConsentData | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(COOKIE_KEY)
  if (stored) return JSON.parse(stored)
  return null
}
