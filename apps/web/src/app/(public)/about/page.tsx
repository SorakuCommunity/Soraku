'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import {
  RocketIcon,
  TargetIcon,
  EyeOpenIcon,
  HeartIcon,
  StarIcon,
  CheckCircledIcon,
  GlobeIcon,
  PersonIcon,
  GroupIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

const SECTION_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']

const PHILOSOPHIES = [
  {
    title: 'Technology Should Empower People',
    description:
      'Every tool, platform, and system we build exists to give people more capability, not to replace them.',
  },
  {
    title: 'Innovation Should Solve Real Problems',
    description:
      'We pursue innovation that addresses genuine needs rather than novelty for its own sake.',
  },
  {
    title: 'Communities Create Sustainable Ecosystems',
    description:
      'Strong communities are the foundation of lasting impact. We invest in people, not just products.',
  },
  {
    title: 'Design and Engineering Must Work Together',
    description:
      'Great products emerge when form and function are developed as one discipline, not two.',
  },
  {
    title: 'Build for the Long Term',
    description:
      'Every decision we make considers the next decade, not just the next quarter.',
  },
]

const BUSINESS_UNITS = [
  {
    name: 'Soraku Studio',
    tagline: 'Creative Agency',
    purpose: 'Delivering brand identities, visual design, and digital experiences that help organisations communicate with impact.',
    responsibilities: ['Brand identity & strategy', 'Visual & UI/UX design', 'Digital experience design'],
    color: '#3b82f6',
    href: '#',
  },
  {
    name: 'Rynex',
    tagline: 'Enterprise Solutions',
    purpose: 'Providing enterprise-grade software engineering, cloud infrastructure, and digital transformation services.',
    responsibilities: ['Software engineering', 'Cloud infrastructure', 'Digital transformation'],
    color: '#8b5cf6',
    href: '#',
  },
  {
    name: 'Soraku Community',
    tagline: 'Community Platform',
    purpose: 'A collaborative space where creators, developers, designers, and innovators learn, build, and grow together.',
    responsibilities: ['Knowledge sharing', 'Collaborative projects', 'Events & workshops'],
    color: '#10b981',
    href: '#',
  },
]

const MISSION_PRINCIPLES = [
  'Build meaningful technology',
  'Empower creators',
  'Strengthen communities',
  'Deliver enterprise-quality software',
  'Encourage continuous learning',
  'Drive sustainable innovation',
]

const CORE_VALUES = [
  {
    icon: StarIcon,
    title: 'Innovation',
    description: 'We push boundaries and embrace emerging technologies to build solutions that define the future of digital experiences.',
  },
  {
    icon: CheckCircledIcon,
    title: 'Integrity',
    description: 'Transparency, honesty, and ethical practices form the foundation of our relationships with clients, partners, and communities.',
  },
  {
    icon: TargetIcon,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards of quality, craftsmanship, and attention to detail in every project we undertake.',
  },
  {
    icon: GroupIcon,
    title: 'Collaboration',
    description: 'Great things happen when diverse talents come together. We champion cross-disciplinary teamwork and shared success.',
  },
  {
    icon: HeartIcon,
    title: 'Community',
    description: 'People are at the heart of everything we do. We foster inclusive spaces where creators, developers, and innovators thrive.',
  },
]

const MILESTONES = [
  { label: 'Projects Delivered', value: '50+' },
  { label: 'Partners & Clients', value: '20+' },
  { label: 'Community Members', value: '1,000+' },
  { label: 'Team Contributors', value: '15+' },
]

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground/40">{number}</span>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground/60">{label}</span>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              About <span className="text-primary">Soraku</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
              Soraku is a technology ecosystem connecting creativity, engineering, and community
              to build meaningful digital experiences for the future.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#ecosystem"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90"
              >
                Explore Our Ecosystem <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 - Who We Are ── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] to-transparent p-8 sm:p-10 lg:p-12">
            <div className="relative">
              <SectionLabel number={SECTION_NUMBERS[0]} label="Who We Are" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Who is Soraku?
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Soraku is a technology ecosystem, not a traditional company. We operate
                  across multiple disciplines&mdash;creative agency, enterprise software, and
                  community platform&mdash;united by a single purpose: to build meaningful
                  digital experiences that empower people and strengthen communities.
                </p>
                <p>
                  We think long-term, act with integrity, and measure success by the impact
                  we create rather than the output we produce. Every product, partnership,
                  and platform within the Soraku ecosystem exists to serve this vision.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 02 - Our Philosophy ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[1]} label="Our Philosophy" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            What We Believe
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Our philosophy shapes how we approach every challenge, relationship, and opportunity.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PHILOSOPHIES.map((item) => (
              <Card key={item.title} className="group">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 - What We Build ── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[2]} label="What We Build" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Current Business Units
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Today, the Soraku ecosystem comprises three core business units serving distinct
            but interconnected missions.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {BUSINESS_UNITS.map((unit) => (
              <Card key={unit.name} className="group flex flex-col">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${unit.color}15`, color: unit.color }}
                  >
                    <RocketIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{unit.name}</h3>
                    <p className="text-xs text-muted-foreground/70">{unit.tagline}</p>
                  </div>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {unit.purpose}
                </p>
                <ul className="mb-6 space-y-2 text-sm text-muted-foreground/70">
                  {unit.responsibilities.map((r) => (
                    <li key={r} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary/50" />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link
                    href={unit.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 - Our Ecosystem ── */}
      <section id="ecosystem" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[3]} label="Our Ecosystem" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            How It All Connects
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every member of the Soraku ecosystem contributes to a single shared vision.
            The relationship is hierarchical by structure but collaborative by nature.
          </p>
          <div className="mt-10">
            <div className="relative mx-auto max-w-3xl">
              <Card className="relative z-10 mx-auto mb-12 flex w-56 items-center justify-center border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent py-6 text-center sm:w-64">
                <div>
                  <GlobeIcon className="mx-auto mb-1 h-6 w-6 text-primary" />
                  <p className="text-lg font-bold tracking-tight text-foreground">Soraku</p>
                  <p className="text-xs text-muted-foreground/60">Technology Ecosystem</p>
                </div>
              </Card>
              <div className="absolute left-1/2 top-28 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 to-transparent sm:top-28" />
              <div className="relative grid gap-6 sm:grid-cols-3">
                {BUSINESS_UNITS.map((unit, i) => (
                  <div key={unit.name} className="relative">
                    {i > 0 && (
                      <div className="absolute -top-12 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 to-transparent max-sm:hidden" />
                    )}
                    <Card className="text-center">
                      <div
                        className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${unit.color}15`, color: unit.color }}
                      >
                        <RocketIcon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{unit.name}</p>
                      <p className="text-xs text-muted-foreground/60">{unit.tagline}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 - Our Story ── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] to-transparent p-8 sm:p-10 lg:p-12">
            <div className="relative">
              <SectionLabel number={SECTION_NUMBERS[4]} label="Our Story" />
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                The Journey Behind Soraku
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Soraku was founded to bridge a gap. We saw talented creators, ambitious
                  businesses, and passionate communities operating in isolation&mdash;each
                  with enormous potential, but without the right connections, tools, or
                  platforms to realise it.
                </p>
                <p>
                  What began as conversations between developers, designers, and community
                  builders evolved into something larger. We realised that the problems we
                  cared about could not be solved by any single product or service. They
                  required an ecosystem&mdash;a network of capabilities working together
                  toward a common purpose.
                </p>
                <p>
                  From those early discussions, Soraku Studio emerged as our creative arm,
                  Rynex as our engineering foundation, and the Soraku Community as the
                  connective tissue bringing people together. Each unit grew organically,
                  shaped by real needs rather than theoretical plans.
                </p>
                <p>
                  Today, Soraku continues to evolve. We remain committed to the same
                  principles that guided our early days: build meaningful things, empower
                  the people who use them, and create lasting value for the communities we serve.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 06 - Vision & Mission ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[5]} label="Vision & Mission" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Where We Are Heading
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Card className="p-8 text-center lg:p-10">
              <EyeOpenIcon className="mx-auto mb-5 h-8 w-8 text-primary" />
              <h3 className="mb-3 text-xl font-bold text-foreground">Our Vision</h3>
              <p className="max-w-md mx-auto text-base leading-relaxed text-muted-foreground">
                To be the leading technology ecosystem that empowers creators, transforms
                businesses, and shapes the future of digital innovation across Southeast Asia
                and beyond.
              </p>
            </Card>
            <Card className="p-8 lg:p-10">
              <TargetIcon className="mx-auto mb-5 h-8 w-8 text-primary" />
              <h3 className="mb-6 text-center text-xl font-bold text-foreground">Our Mission</h3>
              <ul className="space-y-3">
                {MISSION_PRINCIPLES.map((m) => (
                  <li key={m} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    {m}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 07 - Core Values ── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[6]} label="Core Values" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            What Guides Every Decision
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            These five principles influence how we work, how we treat each other, and how we
            serve our ecosystem.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CORE_VALUES.map((v) => (
              <Card key={v.title} className="text-center">
                <v.icon className="mx-auto mb-4 h-6 w-6 text-primary" />
                <h3 className="mb-2 text-sm font-semibold text-foreground">{v.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 - Leadership ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[7]} label="Leadership" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Who Leads the Journey
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Leadership information will be introduced as our ecosystem continues to grow.
          </p>
          <Card className="mt-10 flex flex-col items-center py-16 text-center">
            <PersonIcon className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              We believe in sharing leadership details when the story is ready to be told.
              Check back as the Soraku ecosystem evolves.
            </p>
          </Card>
        </div>
      </section>

      {/* ── 09 - Our Impact ── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionLabel number={SECTION_NUMBERS[8]} label="Our Impact" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Measurable Progress
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            While we are still in our early stages, the Soraku ecosystem has already begun
            to create meaningful momentum through projects, partnerships, and community growth.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((m) => (
              <Card key={m.label} className="text-center">
                <p className="text-2xl font-bold tracking-tight text-foreground">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{m.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10 - Join the Journey ── */}
      <section className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/[0.06] to-transparent p-8 text-center sm:p-12 lg:p-16">
            <div className="relative">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
              <SectionLabel number={SECTION_NUMBERS[9]} label="Join the Journey" />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Become Part of the Ecosystem
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
                Whether you want to build with Soraku Studio, work with Rynex, join the
                Soraku Community, or explore career opportunities, there are many ways to
                contribute to what we are creating.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90"
                >
                  Build with Soraku Studio <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted"
                >
                  Join Soraku Community
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground/60">
                <Link href="/contact" className="transition-colors hover:text-primary">Contact Us</Link>
                <span className="text-border">·</span>
                <Link href="/careers" className="transition-colors hover:text-primary">Explore Careers</Link>
                <span className="text-border">·</span>
                <Link href="#" className="transition-colors hover:text-primary">Partner with Soraku</Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  )
}
