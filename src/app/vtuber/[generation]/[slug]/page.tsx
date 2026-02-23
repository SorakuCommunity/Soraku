import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Twitter, Youtube, Instagram, Globe, ExternalLink } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase";
import { getGenerationLabel } from "@/lib/utils";

interface Props {
  params: { generation: string; slug: string };
}

async function getVtuber(slug: string) {
  const { data } = await supabaseAdmin
    .from("vtubers")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export default async function VtuberDetailPage({ params }: Props) {
  const vtuber = await getVtuber(params.slug);
  if (!vtuber) notFound();

  const socialIcons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/vtuber/${params.generation}`}
          className="inline-flex items-center gap-2 text-sm text-light-base/60 hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </Link>

        {/* Profile card */}
        <div className="glass rounded-3xl border border-white/10 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-2/60 to-transparent" />
          </div>

          <div className="px-8 pb-8 relative">
            {/* Avatar */}
            <div className="-mt-12 mb-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-dark-2">
                {vtuber.avatar_url ? (
                  <Image
                    src={vtuber.avatar_url}
                    alt={vtuber.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-3xl font-bold text-white">
                    {vtuber.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-black text-light-base mb-2">{vtuber.name}</h1>

            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium border border-primary/30">
                {getGenerationLabel(vtuber.generation)}
              </span>
              {vtuber.agency && (
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium border border-accent/30">
                  {vtuber.agency}
                </span>
              )}
            </div>

            {vtuber.bio && (
              <div className="glass rounded-xl p-4 mb-6">
                <p className="text-light-base/70 leading-relaxed">{vtuber.bio}</p>
              </div>
            )}

            {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
              <div>
                <h3 className="text-xs text-light-base/40 uppercase tracking-wider font-medium mb-3">
                  Social Media
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(vtuber.social_links as Record<string, string>).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/10 text-light-base/60 text-sm hover:text-primary hover:border-primary/30 transition-all"
                    >
                      {socialIcons[platform] || <Globe className="w-4 h-4" />}
                      <span className="flex-1 capitalize">{platform}</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
