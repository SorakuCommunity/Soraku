import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";

const Contact = () => {
  return (
    <>
      <Navbar withNav toTop shrink bgHover scrollP={110} paddingY={"py-1"} />
      <div className=" flex h-screen w-screen flex-col items-center justify-center font-Archivo  font-bold">
        <h1>Contact Us</h1>
        <p>If you have any questions or comments, please email us at:</p>
        <p>
          <a href="mailto:contact@1Anime.co?subject=[1Anime]%20-%20Your%20Subject">
            contact@1Anime.co
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
