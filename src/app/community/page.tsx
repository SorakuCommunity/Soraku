import Link from "next/link";
import { MessageCircle, Users, Trophy, ArrowRight } from "lucide-react";
import StatsCard from "@/components/StatsCard";

export default function CommunityPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">
            <span className="gradient-text">Komunitas</span> Soraku
          </h1>
          <p className="text-light-base/60">Bergabunglah dan jadilah bagian dari komunitas kami</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Discord Stats */}
          <StatsCard />

          {/* Discord CTA */}
          <div className="glass rounded-2xl p-8 border border-[#5865F2]/30 bg-[#5865F2]/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#5865F2]" />
              </div>
              <div>
                <h3 className="font-semibold text-light-base">Discord Server</h3>
                <p className="text-sm text-light-base/50">Bergabung sekarang!</p>
              </div>
            </div>
            <p className="text-light-base/60 text-sm mb-6">
              Server Discord Soraku adalah pusat komunitas kami. Temui sesama fans, ikuti event, dan dapatkan update terbaru langsung dari talent!
            </p>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4f59d9] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Join Discord
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Community features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Komunitas Aktif",
              desc: "Ribuan member yang aktif setiap hari berbagi konten dan mendukung VTuber.",
            },
            {
              icon: <Trophy className="w-6 h-6 text-yellow-400" />,
              title: "Event Rutin",
              desc: "Event dan kompetisi yang diadakan secara rutin untuk seluruh komunitas.",
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-[#5865F2]" />,
              title: "Chat Langsung",
              desc: "Berinteraksi langsung dengan talent dan sesama fans di Discord.",
            },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-light-base mb-2">{item.title}</h3>
              <p className="text-light-base/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
