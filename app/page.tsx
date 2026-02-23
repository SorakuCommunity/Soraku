import Hero from "@/components/layout/Hero";
import FeaturesSection from "@/components/layout/FeaturesSection";
import DiscordSection from "@/components/community/DiscordSection";
import BlogPreview from "@/components/blog/BlogPreview";
import EventsPreview from "@/components/events/EventsPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <DiscordSection />
      <BlogPreview />
      <EventsPreview />
    </>
  );
}
