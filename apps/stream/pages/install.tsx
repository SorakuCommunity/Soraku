import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for redirection
import { Navbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage = () => {
  const router = useRouter(); // Initialize router
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkPwaSupport = () => {
      // Check if the browser supports the beforeinstallprompt event
      if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
        setIsSupported(true);
      } else {
        setIsSupported(false);
      }
    };

    checkPwaSupport();

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', (event) => handleBeforeInstallPrompt(event as BeforeInstallPromptEvent));
    // Change the type of the event in the removeEventListener call
    return () => {
      window.removeEventListener('beforeinstallprompt', (event) => handleBeforeInstallPrompt(event as BeforeInstallPromptEvent));
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
        if (choiceResult.outcome === 'accepted') {
          alert('Thanks for installing!');
          router.push('/'); // Redirect to home after installation
        } else {
          alert('Installation dismissed.');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('This browser does not support PWA installation.');
    }
  };

  return (
    <div className="min-h-screen bg-primary text-txt pt-16">
      <Head>
        <title>Install PWA</title>
        <meta name="description" content="Install this site as a Progressive Web App" />
      </Head>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Install Our App</h1>
        <p className="mb-4">To install this site as a Progressive Web App, click the button below:</p>
        <button 
          onClick={handleInstallClick} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Install PWA
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default InstallPage;
