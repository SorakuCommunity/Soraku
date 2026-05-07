export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Section } from '@/components/sections/Section'

export const metadata: Metadata = {
  title: 'Tentang Soraku | Soraku',
  description:
    'Soraku adalah platform belajar dan kreator berbasis komunitas yang berfokus pada anime, manga, dan industri kreatif Jepang.',
}

export default function AboutPage() {
  return (
    <main className="text-foreground min-h-screen overflow-x-hidden bg-[#1C1E22]">
      <Section />
    </main>
  )
}
