import { Zap, Users, Star, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6">
            Tentang{" "}
            <span className="gradient-text">Soraku</span>
          </h1>
          <p className="text-xl text-light-base/60 max-w-2xl mx-auto">
            Soraku adalah platform komunitas untuk VTuber Indonesia — tempat bagi talent virtual dan penggemarnya untuk terhubung, berbagi, dan berkembang bersama.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "Platform Modern",
              desc: "Dibangun dengan teknologi terkini untuk memberikan pengalaman terbaik bagi komunitas.",
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Komunitas Solid",
              desc: "Bergabunglah dengan ribuan fans yang saling mendukung para VTuber favorit.",
            },
            {
              icon: <Star className="w-6 h-6 text-accent" />,
              title: "Multi Generasi",
              desc: "Soraku menghadirkan VTuber dari berbagai generasi dengan karakter unik masing-masing.",
            },
            {
              icon: <Heart className="w-6 h-6 text-red-400" />,
              title: "Dibuat dengan Cinta",
              desc: "Setiap fitur dirancang dengan penuh perhatian untuk memenuhi kebutuhan komunitas.",
            },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors card-hover">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-light-base mb-2">{item.title}</h3>
              <p className="text-light-base/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-light-base mb-4">Visi Kami</h2>
          <p className="text-light-base/60 max-w-xl mx-auto">
            Menjadi platform komunitas VTuber Indonesia yang paling lengkap, modern, dan ramah pengguna — tempat di mana setiap orang merasa diterima dan dirayakan.
          </p>
        </div>
      </div>
    </div>
  );
}
