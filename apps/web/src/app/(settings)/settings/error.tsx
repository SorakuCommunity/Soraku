'use client'

import { useEffect } from 'react'
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ExclamationTriangleIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">Terjadi kesalahan</p>
          <p className="text-sm text-muted-foreground">
            Halaman pengaturan gagal dimuat. Silakan coba beberapa saat lagi.
          </p>
        </div>
        <Button variant="outline" onClick={reset}>
          <ReloadIcon className="h-4 w-4" /> Coba lagi
        </Button>
      </CardContent>
    </Card>
  )
}
