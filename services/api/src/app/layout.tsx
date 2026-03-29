import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Soraku API",
  description: "Central REST API untuk ekosistem platform Soraku Community",
}

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
