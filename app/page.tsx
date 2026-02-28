// app/page.tsx - SORAKU 1.0.a3.1 LANDING PAGE REFINEMENT
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Gallery, Users, Music, MessageCircle, Calendar, Image as ImageIcon } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  viewport: { once: true },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO - Clean Hierarchy */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-primary/3 to-secondary/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            {...fadeUp}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-full mb-8 w-fit mx-auto">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary tracking-tight">2.4K Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 leading-[0.9] tracking-tight">
              Soraku
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Anime, VTuber, Music. Join the community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl">
                <Link href="/discord">Join Discord</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-14 px-10 text-lg border-secondary/50">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENTS - Grid 3 Mobile */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div className="text-center mb-20" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Live Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Watch parties, karaoke, collabs
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Anime Night", date: "Mar 15 • 19:00", icon: Calendar },
              { title: "VTuber Karaoke", date: "Mar 22 • 20:00", icon: Music },
              { title: "Manga Discussion", date: "Mar 29 • 18:00", icon: ImageIcon }
            ].map((event, i) => (
              <motion.div 
                key={event.title} 
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card className="h-full border-0 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-secondary/30">
                  <CardHeader className="pb-4">
                    <event.icon className="w-12 h-12 text-primary/80 mb-4 group-hover:scale-110 transition-transform" />
                    <CardTitle className="text-xl font-semibold group-hover:text-primary">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-6">{event.date}</p>
                    <Button variant="ghost" size="sm" className="w-full justify-start h-10 px-4 hover:bg-primary/5 group-hover:translate-x-2 transition-all">
                      View Details →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY HIGHLIGHT - Grid 3 Mobile */}
      <section className="py-24 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div className="text-center mb-20" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Gallery Highlights
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-4 mb-16">
            {['/demo/gallery-1.jpg', '/demo/gallery-2.jpg', '/demo/gallery-3.jpg'].map((src, i) => (
              <motion.div 
                key={i} 
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src={src} 
                  alt="" 
                  fill 
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <span className="text-white font-bold text-sm bg-accent/20 px-3 py-1 rounded-full">
                    +{(i+1) * 100} likes
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeUp} className="text-center">
            <Button size="lg" className="h-14 px-12 text-lg font-semibold shadow-xl">
              <Gallery className="w-5 h-5 mr-2" />
              Browse Gallery
            </Button>
          </motion.div>
        </div>
      </section>

      {/* STATS + DISCORD CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp} className="lg:text-left text-center">
              <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Join 10K+ Members
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discord voice, anime nights, VTuber streams
              </p>
            </motion.div>
            
            <motion.div 
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-8 p-10 bg-card/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-secondary/20"
            >
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-primary mb-2">2,456</p>
                <p className="text-sm text-muted-foreground font-medium">Online Now</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-foreground mb-2">10K+</p>
                <p className="text-sm text-muted-foreground font-medium">Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-foreground mb-2">500+</p>
                <p className="text-sm text-muted-foreground font-medium">Events</p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            {...fadeUp}
            transition={{ delay: 0.4 }}
            className="text-center mt-20"
          >
            <Button size="lg" className="h-16 px-16 text-xl font-bold shadow-2xl bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-primary/90">
              <MessageCircle className="w-6 h-6 mr-3" />
              Join Discord Server
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
