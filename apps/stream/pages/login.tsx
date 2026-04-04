import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  const handleClick = async () => {
    const toastId = toast.loading("Loading...");
    try {
      await signIn("AniListProvider");
      toast.loading("Redirecting you to secure auth...", { id: toastId });
      toast.success("Welcome to 1Anime");
    } catch (error) {
      toast.error("Failed to sign in", { id: toastId });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out.");
    router.push("/");
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-primary flex flex-col pt-16"
    >
      <Head>
        <title>1Anime - Login</title>
        <meta name="description" content="Login to your 1Anime account" />
      </Head>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {status === "loading" ? (
          <div className="max-w-md w-full space-y-8 bg-secondary p-10 rounded-xl shadow-lg flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
            </div>
          </div>
        ) : session ? (
          <div className="max-w-md w-full space-y-8 bg-secondary p-10 rounded-xl shadow-lg text-center">
            <Image
              src={session?.user?.image || "https://avatar.vercel.sh/1"}
              alt="Profile Picture"
              width={120}
              height={120}
              className="mx-auto rounded-full border-4 border-primary shadow-lg"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Welcome back, {session?.user?.name}!
            </h2>
            <p className="text-lg text-gray-200">
              You are logged in to your account.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
              >
                Go to Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-secondary p-10 rounded-xl shadow-lg">
            <div className="text-center">
              <Image
                src="https://1anime.app/logo.svg"
                alt="1Anime Logo"
                width={120}
                height={120}
                className="mx-auto"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-white">
                Sign in to Your Account
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                By signing in/up, you agree to our{" "}
                <a
                  href="https://1anime.app/privacy"
                  className="font-medium text-primary hover:text-secondary"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleClick}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                >
                  <Image
                    src="/svg/anilist-icon.svg"
                    alt="AniList"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign in with AniList
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-200 text-gray-600">
                    No other login options available
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <div className="py-16" />
      <Footer /> {/* Increased footer padding */}
    </motion.div>
  );
}
