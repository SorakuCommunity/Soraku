import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import Link from "next/link";

function Error({ statusCode }: { statusCode: number }) {
  return (
    <>
      <Head>
        <title>Oops! An Error Occurred</title>
      </Head>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <div className="min-h-screen flex items-center justify-center bg-primary text-white">
        <div className="max-w-md w-full p-8 bg-secondary rounded-lg shadow-lg text-center">
          <h1 className="text-6xl font-bold mb-4">Oops!</h1>
          <div className="text-8xl mb-6">(╯°□°）╯︵ ┻━┻</div>
          <p className="text-xl mb-6">
            {statusCode
              ? `Error ${statusCode}: Something went wrong on our end.`
              : "An unexpected error occurred."}
          </p>
          <p className="text-lg mb-8">
            Don't worry, we're on it. Try refreshing or come back later.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-semibold transition-colors duration-300"
            >
              Go Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 rounded-full font-semibold transition-colors duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

Error.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
