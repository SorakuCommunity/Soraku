'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MixerVerticalIcon,
  Pencil2Icon,
  CodeIcon,
  DashboardIcon,
  GlobeIcon,
  LockClosedIcon,
  ReaderIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Service {
  icon: React.ElementType
  title: string
  description: string
  category: string
}

const SERVICES: Service[] = [
  {
    icon: MixerVerticalIcon,
    title: 'Brand Identity',
    description:
      'Strategic brand development, visual identity systems, and cohesive brand experiences that differentiate and resonate.',
    category: 'Design',
  },
  {
    icon: Pencil2Icon,
    title: 'UI/UX Design',
    description:
      'User-centered interface design, interaction design, and prototyping for web and mobile applications.',
    category: 'Design',
  },
  {
    icon: CodeIcon,
    title: 'Web Development',
    description:
      'Full-stack web development using modern frameworks, responsive architecture, and performant front-end engineering.',
    category: 'Engineering',
  },
  {
    icon: DashboardIcon,
    title: 'Enterprise Software',
    description:
      'Scalable enterprise applications, microservices architecture, and custom software solutions for complex business needs.',
    category: 'Engineering',
  },
  {
    icon: GlobeIcon,
    title: 'Cloud & DevOps',
    description:
      'Cloud infrastructure design, CI/CD pipeline automation, container orchestration, and infrastructure as code.',
    category: 'Infrastructure',
  },
  {
    icon: LockClosedIcon,
    title: 'Cybersecurity',
    description:
      'Security audits, threat modeling, compliance frameworks, and robust security architecture for modern applications.',
    category: 'Security',
  },
  {
    icon: ReaderIcon,
    title: 'IT Consulting',
    description:
      'Technology strategy, digital transformation advisory, and technical due diligence for businesses of all sizes.',
    category: 'Advisory',
  },
]

const CTA_LABELS: Record<string, string> = {
  'Brand Identity': 'Explore Brand Identity',
  'UI/UX Design': 'Explore UI/UX Design',
  'Web Development': 'Explore Web Development',
  'Enterprise Software': 'Explore Enterprise',
  'Cloud & DevOps': 'Explore Cloud & DevOps',
  Cybersecurity: 'Explore Cybersecurity',
  'IT Consulting': 'Explore Consulting',
}

export function StickyScrollServices() {
  const [activeIndex, setActiveIndex] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((ref) => ref === entry.target)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    )

    const currentRefs = cardRefs.current
    for (const ref of currentRefs) {
      if (ref) observer.observe(ref)
    }

    return () => {
      for (const ref of currentRefs) {
        if (ref) observer.unobserve(ref)
      }
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        setShowLeft(entry.isIntersecting)
      },
      { threshold: 0 }
    )
    containerObserver.observe(el)
    return () => containerObserver.disconnect()
  }, [])

  const activeService = SERVICES[activeIndex]

  return (
    <section ref={containerRef} className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Left — Sticky */}
          <div className="lg:col-span-5">
            <div
              className={cn(
                'lg:sticky lg:top-28 lg:pb-24',
                'transition-opacity duration-200',
                showLeft ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div className="mb-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#3b82f6]/80">
                Capabilities
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#f1f5f9] sm:text-4xl lg:text-5xl">
                Featured Services
              </h2>
              <p className="mt-3 text-[#94a3b8]">
                Comprehensive technology services delivered by our team of experienced engineers
                and creatives.
              </p>

              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                  <activeService.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#f1f5f9]">{activeService.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                  {activeService.description}
                </p>
                <span className="mt-4 inline-flex items-center rounded-md border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-2.5 py-0.5 text-xs font-medium text-[#3b82f6]">
                  {activeService.category}
                </span>
              </div>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#3b82f6]/90 hover:shadow-md"
                >
                  {CTA_LABELS[activeService.title] ?? 'Contact Us'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right — Scrollable Cards */}
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <div className="space-y-4">
              {SERVICES.map((service, index) => (
                <div
                  key={service.title}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  className={cn(
                    'rounded-xl border p-5 transition-all duration-[120ms] sm:p-6',
                    index === activeIndex
                      ? 'border-[#3b82f6]/30 bg-white/[0.05] shadow-sm'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                        index === activeIndex
                          ? 'bg-[#3b82f6]/15 text-[#3b82f6]'
                          : 'bg-white/[0.04] text-[#94a3b8]'
                      )}
                    >
                      <service.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            'text-sm font-medium transition-colors duration-200',
                            index === activeIndex ? 'text-[#f1f5f9]' : 'text-[#94a3b8]'
                          )}
                        >
                          {service.title}
                        </h3>
                        <span className="shrink-0 rounded-md border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-[#94a3b8]/60">
                          {service.category}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'mt-1 text-xs leading-relaxed transition-opacity duration-200',
                          index === activeIndex ? 'text-[#94a3b8]' : 'text-[#94a3b8]/60'
                        )}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
