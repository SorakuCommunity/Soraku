'use client'

import { Send, Clock, Handshake, GraduationCap, HeartHandshake, Users, PenTool, Search, CheckCircle2, Rocket, MapPin, Sparkles, Briefcase, Star, Globe } from 'lucide-react'
import {
  ArrowRightIcon,
  CheckCircledIcon,
  GroupIcon,
  HeartIcon,
  StarIcon,
  GlobeIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const BENEFITS = [
  {
    icon: GlobeIcon,
    title: 'Remote-First Culture',
    description:
      'Work from anywhere in the world. Our team spans multiple time zones, and we have the tools and practices to make remote collaboration seamless.',
  },
  {
    icon: GraduationCap,
    title: 'Growth & Learning',
    description:
      'Annual learning budget, mentorship programs, and access to premium courses. We invest in your professional development.',
  },
  {
    icon: StarIcon,
    title: 'Creative Freedom',
    description:
      'Own your projects from ideation to execution. We trust our team to make decisions and experiment with new approaches.',
  },
  {
    icon: RocketIcon,
    title: 'Impact at Scale',
    description:
      'Build products used by thousands of creators and learners across Indonesia. Your work will have a real impact on the community.',
  },
]

const POSITIONS = [
  { title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'UI/UX Designer', department: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Community Manager', department: 'Community', location: 'Remote', type: 'Full-time' },
  { title: 'Content Writer', department: 'Marketing', location: 'Remote', type: 'Part-time' },
  { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time' },
  { title: 'Marketing Lead', department: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'Data Analyst', department: 'Engineering', location: 'Remote', type: 'Internship' },
]

const INTERNSHIPS = [
  {
    title: 'Software Engineering Intern',
    description:
      'Work alongside senior engineers on real projects. Ideal for final-year students or recent graduates passionate about web development.',
    period: '3-6 months',
  },
  {
    title: 'Design Intern',
    description:
      'Contribute to our design system and product interfaces. Portfolio of UI/UX work required.',
    period: '3 months',
  },
  {
    title: 'Community Intern',
    description:
      'Help manage and grow our online communities across Discord and social media platforms.',
    period: '3-6 months',
  },
]

const VOLUNTEER_ROLES = [
  {
    title: 'Event Organizer',
    description:
      'Plan and run online events, workshops, and meetups for the Soraku community.',
  },
  {
    title: 'Content Moderator',
    description:
      'Help maintain a safe and welcoming environment across our community platforms.',
  },
  {
    title: 'Translation Contributor',
    description:
      'Help translate Soraku content and resources into regional languages across Indonesia.',
  },
]

const HIRING_STEPS = [
  { step: 1, title: 'Apply', icon: PenTool, description: 'Submit your application through our portal.' },
  { step: 2, title: 'Review', icon: Search, description: 'Our team reviews your portfolio and experience.' },
  { step: 3, title: 'Interview', icon: Users, description: 'Meet the team through a series of conversations.' },
  { step: 4, title: 'Offer', icon: CheckCircle2, description: 'Receive an offer and join the Soraku team.' },
]

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="secondary" className="text-xs">
      <Sparkles className="h-3 w-3 mr-1.5" />
      {children}
    </Badge>
  )
}

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-8 shadow-lg backdrop-blur-xl sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative">
          <SectionBadge>We&apos;re Hiring</SectionBadge>
          <h1 className="mt-4 text-[clamp(2.2rem,8vw,4rem)] leading-[0.9] font-black tracking-tighter text-foreground">
            Join Our Team
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            At Soraku, we&apos;re building the future of community-driven learning and creativity.
            We&apos;re looking for passionate individuals who want to make an impact at scale - from
            engineering and design to community and operations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#positions">View Open Positions <ArrowRightIcon className="h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#culture">Learn About Our Culture</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="mt-16">
        <div className="mb-10 text-center">
          <SectionBadge>Benefits</SectionBadge>
          <h2 className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
            Why Work With Us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            We believe in creating an environment where talented people can do their best work.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <Card key={title} hover className="text-center sm:text-left">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section id="positions" className="mt-16 scroll-mt-24">
        <div className="mb-10 text-center">
          <SectionBadge>Opportunities</SectionBadge>
          <h2 className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
            Open Positions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Find your fit at Soraku. All roles are remote-first unless otherwise noted.
          </p>
        </div>
        <div className="space-y-4">
          {POSITIONS.map(({ title, department, location, type }) => {
            const typeColor =
              type === 'Full-time'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : type === 'Part-time'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  : 'border-violet-500/30 bg-violet-500/10 text-violet-400'
            return (
              <Card key={title} hover className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-foreground">{title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="text-[10px]">{department}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {location}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold',
                        typeColor,
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {type}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" asChild>
                  <a href="/careers">Apply <ArrowRightIcon className="h-3.5 w-3.5" /></a>
                </Button>
              </Card>
            )
          })}
        </div>
      </section>

      {/* ── Internship & Volunteer ── */}
      <section className="mt-16">
        <div className="mb-10 text-center">
          <SectionBadge>Get Involved</SectionBadge>
          <h2 className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
            Internship & Volunteer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Not ready for a full-time role? There are still ways to be part of the Soraku ecosystem.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Internships */}
          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Internships</h3>
                <p className="text-xs text-muted-foreground">Gain real-world experience</p>
              </div>
            </div>
            <div className="space-y-4">
              {INTERNSHIPS.map(({ title, description, period }) => (
                <div
                  key={title}
                  className="rounded-lg border border-border bg-muted/50 p-4 transition-all hover:border-primary/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-foreground">{title}</h4>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {period}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Volunteer */}
          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <HeartHandshake className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Volunteer</h3>
                <p className="text-xs text-muted-foreground">Contribute to the community</p>
              </div>
            </div>
            <div className="space-y-4">
              {VOLUNTEER_ROLES.map(({ title, description }) => (
                <div
                  key={title}
                  className="rounded-lg border border-border bg-muted/50 p-4 transition-all hover:border-primary/20"
                >
                  <h4 className="text-sm font-bold text-foreground">{title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ── Hiring Process ── */}
      <section className="mt-16">
        <div className="mb-10 text-center">
          <SectionBadge>Process</SectionBadge>
          <h2 className="mt-3 text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
            Our Hiring Process
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Designed to be transparent, fair, and respectful of your time.
          </p>
        </div>
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute top-12 left-[calc(1.5rem+1px)] hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:block" />
          {HIRING_STEPS.map(({ step, title, icon: Icon, description }, index) => (
            <div key={step} className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
                  <span className="text-sm font-bold text-primary">{step}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ── Culture CTA ── */}
      <section
        id="culture"
        className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center shadow-lg backdrop-blur-xl sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative">
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-lg shadow-black/20">
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl lg:text-5xl">
            Ready to make an impact?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Join a team that&apos;s building the future of community-driven learning. We&apos;d love
            to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <a href="#positions">Apply Now <ArrowRightIcon className="h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:careers@soraku.id">Get in Touch</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}