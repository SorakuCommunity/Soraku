'use client'

import Link from 'next/link'
import {
  ArrowRightIcon,
  GlobeIcon,
  TargetIcon,
  EyeOpenIcon,
  HeartIcon,
  CheckCircledIcon,
  GroupIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import { Building2, Users, Briefcase, Newspaper, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── Section Heading ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-12 text-center">
      <Badge variant="secondary" className="mb-4 text-xs">{eyebrow}</Badge>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] animate-pulse rounded-full bg-primary/5 blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
            Premium Enterprise Ecosystem
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            The <span className="text-primary">Soraku</span> Ecosystem
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            A technology ecosystem building digital products, empowering creators, and growing communities worldwide.
            We engineer excellence across every layer of the modern technology stack.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/about">About Soraku <ArrowRightIcon className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Ecosystem Overview ────────────────────────────────────────────────────────
const ECOSYSTEM_ITEMS = [
  {
    icon: GlobeIcon,
    name: 'Soraku Studio',
    category: 'Creative Agency',
    description: 'Full-service creative agency delivering brand identities, visual design, and digital experiences that captivate audiences.',
  },
  {
    icon: Building2,
    name: 'Rynex',
    category: 'Enterprise Solutions',
    description: 'Enterprise-grade software solutions, cloud infrastructure, and digital transformation services for modern businesses.',
  },
  {
    icon: GroupIcon,
    name: 'Soraku Community',
    category: 'Community',
    description: 'A thriving community of creators, developers, and innovators collaborating on projects and sharing knowledge.',
  },
]

function EcosystemSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Our Ecosystem"
          title="Explore the Soraku Ecosystem"
          description="A unified network of brands, communities, and services working together to drive innovation."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {ECOSYSTEM_ITEMS.map((item) => (
            <Card key={item.name} className="group hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mb-4 flex items-center justify-between">
                  <item.icon className="h-8 w-8 text-primary" />
                  <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4">{item.description}</p>
                <Link
                  href={`/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Explore <ArrowRightIcon className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Vision, Mission & Values ─────────────────────────────────────────────────
function VisionMissionValuesSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Soraku"
          title="Vision, Mission & Values"
          description="What drives everything we build."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GlobeIcon className="h-6 w-6" />
              </div>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To be the leading technology ecosystem that empowers creators, transforms businesses, and shapes the future of digital innovation.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <EyeOpenIcon className="h-6 w-6" />
              </div>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                To build world-class digital products, foster thriving communities, and provide accessible education that accelerates careers.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Star className="h-6 w-6" />
              </div>
              <CardTitle>Core Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Innovation, Community, and Excellence guide every decision, every product, and every partnership we pursue.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-8">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="mb-4 text-2xl font-bold text-foreground">Our Philosophy</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                We believe technology is a force for empowerment. Every product we build, every community we nurture, and every partnership we forge is driven by a single purpose: to create lasting impact. From enterprise solutions to creative media, the Soraku ecosystem is united by a shared commitment to quality, innovation, and human-centered design.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ─── Services (Sticky Scroll) ────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    { icon: EyeOpenIcon, title: 'Brand Identity', desc: 'Strategic brand development, visual identity systems, and cohesive brand experiences.', category: 'Design' },
    { icon: Sparkles, title: 'UI/UX Design', desc: 'User-centered design, wireframing, prototyping, and design systems for exceptional user experiences.', category: 'Design' },
    { icon: GlobeIcon, title: 'Software Engineering', desc: 'Full-stack development, system architecture, and scalable application design using modern frameworks.', category: 'Engineering' },
    { icon: Building2, title: 'Enterprise Architecture', desc: 'Enterprise-level system design, microservices architecture, and cloud-native infrastructure planning.', category: 'Engineering' },
    { icon: HeartIcon, title: 'DevOps & Cloud', desc: 'CI/CD pipelines, containerization, infrastructure as code, and cloud infrastructure management.', category: 'Engineering' },
    { icon: CheckCircledIcon, title: 'Cybersecurity', desc: 'Security audits, penetration testing, compliance frameworks, and robust security architecture.', category: 'Engineering' },
  ]

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="Featured Services"
          description="Comprehensive technology services delivered by our team of experienced engineers and creatives."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="group p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{service.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{service.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Latest News ──────────────────────────────────────────────────────────────
const NEWS_ARTICLES = [
  {
    title: 'Introducing Soraku Studio 2.0',
    excerpt: 'A complete redesign of our creative agency platform with new collaboration tools and an expanded service catalog.',
    date: 'Jun 15, 2026',
    category: 'Product',
  },
  {
    title: 'Rynex Cloud Platform Goes Live',
    excerpt: 'Our enterprise cloud infrastructure platform is now generally available, serving businesses across Southeast Asia.',
    date: 'May 28, 2026',
    category: 'Engineering',
  },
  {
    title: 'Soraku Community Reaches 1,000 Members',
    excerpt: 'Our educational platform surpasses a major milestone with students from over 30 countries enrolled in our programs.',
    date: 'May 10, 2026',
    category: 'Community',
  },
]

function NewsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Latest Updates"
          title="Latest News"
          description="Stay informed with the latest from across the Soraku ecosystem."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {NEWS_ARTICLES.map((article) => (
            <Card key={article.title} className="group overflow-hidden">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
                <Newspaper className="h-10 w-10 text-primary/30" />
              </div>
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{article.category}</Badge>
                  <span className="text-[10px] text-muted-foreground/60">{article.date}</span>
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{article.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{article.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/blog">View All Articles <ArrowRightIcon className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Careers ───────────────────────────────────────────────────────────────────
const OPEN_POSITIONS = [
  { title: 'Senior Software Engineer', type: 'Full-time', department: 'Engineering', location: 'Remote' },
  { title: 'Product Designer', type: 'Full-time', department: 'Design', location: 'Remote' },
  { title: 'Community Manager', type: 'Full-time', department: 'Community', location: 'Remote' },
]

function CareersSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Careers"
          title="Join Our Team"
          description="Help us shape the future of the Soraku ecosystem."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {OPEN_POSITIONS.map((position) => (
            <Card key={position.title} className="p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <Badge variant="secondary" className="mb-3 text-[10px]">{position.department}</Badge>
              <h3 className="mb-1 text-base font-semibold text-foreground">{position.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{position.type}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>{position.location}</span>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/careers">View Open Positions <ArrowRightIcon className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// ─── Partners Marquee ─────────────────────────────────────────────────────────
const PARTNERS = [
  'Vercel', 'Stripe', 'Linear', 'Supabase', 'Cloudflare',
  'AWS', 'Google Cloud', 'Azure', 'GitHub', 'Figma',
]

function PartnersSection() {
  const loop = [...PARTNERS, ...PARTNERS]
  return (
    <section className="py-16 sm:py-24">
      <div className="marquee-mask relative overflow-hidden">
        <div className="marquee-track flex overflow-hidden">
          <div className="marquee gap-8 sm:gap-12 pr-8 sm:pr-12">
            {loop.map((partner, i) => (
              <div
                key={`${partner}-${i}`}
                className="flex items-center whitespace-nowrap text-lg font-semibold text-muted-foreground/70"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-24 text-center">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Let&apos;s Build Together
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Whether you need a product built, want to join our community, or explore partnership opportunities, we are ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/about">Build with Soraku Studio <ArrowRightIcon className="h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/community">Join Soraku Community <Users className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Business Team <Briefcase className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <EcosystemSection />
      <VisionMissionValuesSection />
      <ServicesSection />
      <NewsSection />
      <CareersSection />
      <PartnersSection />
      <CTASection />
    </main>
  )
}