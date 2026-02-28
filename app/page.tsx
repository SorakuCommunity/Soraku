// app/page.tsx - SORAKU 1.0.a3.1 NO SHADCN DEPENDENCY
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Gallery, MessageCircle, Calendar, Image as ImageIcon } from 'lucide-react'

const Button = ({ children, href, className = '', variant = 'default', ...props }: any) => (
  <Link 
    href={href}
    className={`
      inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold 
      transition-all duration-200 shadow-lg hover:shadow-xl
      ${variant === 'outline' 
        ? 'border-2 border-secondary/50 bg-transparent text-foreground hover:bg-secondary/20' 
        : 'bg-gradient-to-r from-primary to-accent text-foreground hover:from-primary hover:to-primary/90 hover:scale-[1.02]'
      }
      ${className}
    `}
    {...props}
  >
    {children}
  </Link>
)

const Card = ({ children, className = '', ...props }: any) => (
  <div 
    className={`
      bg-card/90 backdrop-blur-sm rounded-2xl border border-secondary/30 p-8 shadow-lg
      hover:shadow-2xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-5 py-2 rounded-full mb-8 w-fit mx-auto border border-primary/20">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-primary">2.4K Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-black bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent mb-6 leading-tight">
              Soraku
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Anime, VTuber, Music. Join us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 text-lg px-10 shadow-xl">
                Join Discord
              </Button>
              <Button variant="outline" className="h-14 text-lg px-10">
                View Gallery
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENTS - Grid 3 Mobile */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Live Events
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Anime Night", date: "Mar 15 • 19:00", icon: Calendar },
              { title: "VTuber Karaoke", date: "Mar 22 • 20:00", icon: MessageCircle },
              { title: "Manga Talk", date: "Mar 29 • 18:00", icon: ImageIcon }
            ].map((event, i) => (
              <motion.div 
                key={event.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Card className="h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <event.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">{event.date}</p>
                  <Button variant="ghost" className="w-full h-12 px-4">
                    View Details →
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY HIGHLIGHT */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto">
            {[1,2,3].map((i) => (
              <motion.div 
                key={i}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-muted to-secondary animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <span className="text-white font-bold text-sm bg-accent/30 px-3 py-1 rounded-full">
                    +{i * 100} likes
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button size="lg" className="h-14 px-12 text-lg shadow-xl">
              <Gallery className="w-5 h-5 mr-2" />
              Browse Gallery
            </Button>
          </motion.div>
        </div>
      </section>

      {/* DISCORD CTA */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.h3 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Ready to join?
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" className="h-16 px-16 text-xl font-bold shadow-2xl">
              <MessageCircle className="w-6 h-6 mr-3" />
              Join Discord Server
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
