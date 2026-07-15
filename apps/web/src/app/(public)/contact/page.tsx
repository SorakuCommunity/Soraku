'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Handshake, Mic, LifeBuoy, Send, MessageCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const CONTACT_CHANNELS = [
  {
    Icon: Mail,
    label: 'Business Inquiry',
    value: 'business@soraku.id',
    href: 'mailto:business@soraku.id',
    description: 'For partnerships, collaborations, and business development opportunities.',
  },
  {
    Icon: Handshake,
    label: 'Partnership',
    value: 'partnership@soraku.id',
    href: 'mailto:partnership@soraku.id',
    description: 'Strategic alliances, sponsorships, and joint venture inquiries.',
  },
  {
    Icon: Mic,
    label: 'Media',
    value: 'media@soraku.id',
    href: 'mailto:media@soraku.id',
    description: 'Press releases, media coverage, and content licensing requests.',
  },
  {
    Icon: LifeBuoy,
    label: 'Support',
    value: 'support@soraku.id',
    href: 'mailto:support@soraku.id',
    description: 'Technical assistance, account support, and general troubleshooting.',
  },
]

const SUBJECT_OPTIONS = ['General', 'Business', 'Partnership', 'Media', 'Support']

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: 'General', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle>Send a Message</CardTitle>
        <CardDescription>We'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                disabled={status === 'submitting'}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                disabled={status === 'submitting'}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === 'submitting'}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell us about your project or inquiry..."
              className="min-h-[150px]"
              disabled={status === 'submitting'}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
          </Button>
          {status === 'success' && (
            <p className="text-center text-sm text-green-500">Thank you! We&apos;ll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm text-red-500">Something went wrong. Please try again.</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

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
            Let&apos;s start a conversation
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Contact <span className="text-primary">Us</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            We&apos;d love to hear from you. Whether you have a question, a project idea,
            or just want to say hello, reach out and let&apos;s start a conversation.
          </p>
        </div>
      </div>
    </section>
  )
}

function ContactChannelsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-xs">Channels</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Reach Out Directly
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Choose the channel that best fits your needs. We monitor all channels during business hours.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CHANNELS.map((channel) => (
            <Card key={channel.label} className="group hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <channel.Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{channel.label}</h3>
                    <p className="text-sm text-muted-foreground">{channel.value}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{channel.description}</p>
                <a
                  href={channel.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Send Email <Send className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function BusinessHoursSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-y border-border">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-xs">Availability</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Business Hours
          </h2>
        </div>
        <div className="mx-auto max-w-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Monday - Friday</span>
              </div>
              <span className="text-sm text-muted-foreground">09:00 - 18:00 WIB</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Saturday</span>
              </div>
              <span className="text-sm text-muted-foreground">Closed</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Sunday</span>
              </div>
              <span className="text-sm text-muted-foreground">Closed</span>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Response time: Typically within 24 hours during business days.
          </p>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: 'How long does it take to get a response?',
      a: 'We typically respond within 24 hours during business days. For urgent matters, please mark your email as urgent.',
    },
    {
      q: 'Can I schedule a meeting with the team?',
      a: 'Yes! For business inquiries and partnerships, we can schedule a call. Please use the Business Inquiry channel.',
    },
    {
      q: 'Do you offer internships or volunteer positions?',
      a: 'Yes, we occasionally offer internship and volunteer opportunities. Check our Careers page or contact us directly.',
    },
    {
      q: 'What information should I include in my message?',
      a: 'Please include your name, organization (if applicable), the nature of your inquiry, and any relevant details or links.',
    },
  ]

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-xs">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                </div>
                <p className="mt-3 ml-11 text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-24 text-center">
            <MessageCircle className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Ready to Start a Project?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Whether you need a product built, want to join our community, or explore partnership opportunities, we are ready.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/about">About Soraku <Send className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/careers">Explore Careers</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Business Team <Handshake className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ContactChannelsSection />
      <ContactForm />
      <BusinessHoursSection />
      <FAQSection />
      <CTASection />
    </main>
  )
}