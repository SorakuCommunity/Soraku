import Head from "next/head";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";

export default function About() {
  return (
    <>
      <Head>
        <title>1Anime - About Us</title>
        <meta name="title" content="About 1Anime" />
        <meta
          name="description"
          content="Discover the story behind 1Anime, your ultimate destination for free, ad-free anime streaming and manga reading. Learn about our mission, values, and commitment to the anime community."
        />
        <meta name="about" content="About 1Anime" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center items-center min-h-screen md:py-0 py-16"
      >
        <div className="max-w-screen-lg w-full px-4 py-10">
          <h1 className="text-4xl font-bold mb-6">About 1Anime</h1>
          <p className="text-lg mb-8">
            Welcome to 1Anime, your premier destination for free, ad-free anime streaming and manga reading. Founded by passionate anime enthusiasts, our platform was born from a desire to create a seamless, enjoyable experience for fans worldwide.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-8">
            At 1Anime, our mission is to break down barriers and make anime and manga accessible to everyone. We believe that great stories should be shared without interruptions or geographical limitations. That's why we offer our content free of charge, without ads, and without the need for VPNs.
          </p>
          <h2 className="text-2xl font-semibold mb-4">What Sets Us Apart</h2>
          <ul className="list-disc list-inside text-lg mb-8">
            <li className="mb-2">Vast Library: Explore our extensive collection of anime and manga across various genres.</li>
            <li className="mb-2">High-Quality Streaming: Enjoy smooth, high-definition video playback powered by our robust servers.</li>
            <li className="mb-2">User-Friendly Interface: Navigate our platform with ease, whether you're on desktop or mobile.</li>
            <li className="mb-2">Community-Driven: We value your feedback and continuously improve based on user suggestions.</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg mb-8">
            We're committed to supporting the anime and manga industry while providing a free service. We encourage our users to support official releases and creators whenever possible. Our platform serves as a gateway to discover new series and revisit classics, fostering a growing community of anime lovers.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8">
            1Anime is more than just a streaming platform; it's a community. We invite you to join our forums, participate in discussions, and connect with fellow anime enthusiasts from around the globe. Your passion fuels our dedication to continually enhance and expand our services.
          </p>
          <p className="text-lg mb-8">
            Thank you for choosing 1Anime as your go-to platform for anime and manga. We're excited to be part of your journey through the wonderful world of Japanese animation and comics. If you have any questions, suggestions, or just want to say hello, we'd love to hear from you!
          </p>
          <Link href="/contact">
            <div className="bg-[#ffffff] text-black font-medium py-3 px-6 rounded-lg hover:bg-action transition duration-300 ease-in-out inline-block">
              Contact Us
            </div>
          </Link>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
