import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function NotFound() {
  return (
    <Card className="mx-auto w-full max-w-3xl border-border bg-card">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ExclamationTriangleIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">Pengguna tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Profil dengan username tersebut tidak tersedia.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/">Kembali ke beranda</a>
        </Button>
      </CardContent>
    </Card>
  )
}
