import Head from "next/head";
import Footer from "@/components/shared/footer";
import { Navbar } from "@/components/shared/NavBar";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const GameOverSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="600"
    height="600"
    className="w-[40vw] md:w-[25vw] mb-8 animate-bounce"
  >
    <circle cx="32" cy="32" r="30" fill="#ffcc00" />
    <rect x="20" y="20" width="24" height="24" fill="#ff5733" />
    <path d="M32 10 L38 20 H26 Z" fill="#ff5733" />
    <text x="32" y="40" fontSize="12" textAnchor="middle" fill="#ffffff" fontWeight="bold">
      Game Over!
    </text>
  </svg>
);

export default function Custom404() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>404 - Game Over!</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-500 to-yellow-500 text-black">
        <GameOverSVG />
        <h1 className="text-4xl sm:text-6xl xl:text-8xl font-bold mb-6 text-center">
          Game Over! 🎮
        </h1>
        <p className="text-lg sm:text-xl xl:text-2xl text-gray-800 mb-10 text-center max-w-2xl">
          Oops! It seems you've stumbled into a glitch in the matrix. This page doesn't exist!
        </p>
        <p className="text-md sm:text-lg xl:text-xl text-gray-700 mb-4 text-center">
          But don't worry, you can respawn!
        </p>
        <div className="flex flex-col sm:flex-row gap-5 font-Archivo">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-out"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Try Again
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="py-3 px-6 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all duration-300 ease-out"
          >
            Go to Home Page
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
