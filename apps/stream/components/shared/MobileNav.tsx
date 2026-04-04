import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { AiOutlineCalendar } from "react-icons/ai"; // Importing the calendar icon
import { FaRandom } from "react-icons/fa"; // Importing the random icon
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

const MobileNavOld = dynamic(() => import('./OldMobileNav').then(mod => mod.MobileNav), { ssr: false });

type MobileNavProps = {
  hideProfile?: boolean;
};

export default function MobileNav({ hideProfile = false }: MobileNavProps) {
  const { data: sessions }: { data: any } = useSession();
  const { data: session }: { data: any } = useSession();
  const router = useRouter();
  
  const [showOldNav, setShowOldNav] = useState(false);
  const [showSauce, setShowSauce] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedShowSauce = localStorage.getItem('showSauce');
    setShowSauce(storedShowSauce === 'true');

    const storedOldNav = localStorage.getItem('useOldNav');
    setShowOldNav(storedOldNav === 'true');
  }, []);

  // Render OldMobileNav conditionally
  if (showOldNav) {
    return <MobileNavOld hideProfile={hideProfile} />;
  }

  const isActive = (path: string) => router.pathname === path;

  const handleRandomClick = () => {
    setShowModal(true);
  };

  const handleChoice = (choice: string) => {
    setShowModal(false);
    router.push(`/${choice}/random`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary shadow-lg lg:hidden rounded-t-2xl">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center justify-center ${isActive('/') ? 'bg-primary text-white' : 'text-gray-400'}`}>
          <HomeIcon className={`w-6 h-6 ${isActive('/') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors duration-200`} />
          <span className={`text-xs mt-1 ${isActive('/') ? 'text-white' : 'text-gray-400'}`}>Home</span>
        </Link>
        <button 
          className="flex flex-col items-center justify-center text-gray-400"
          onClick={handleRandomClick}
        >
          <FaRandom className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-200" />
          <span className="text-xs mt-1 text-gray-400">Random</span>
        </button>

        {/* Modal for Random Choice */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-2 text-white">Choose:</h2>
              <button className="block mb-2 text-blue-500" onClick={() => handleChoice('anime')}>Random Anime</button>
              <button className="block text-blue-500" onClick={() => handleChoice('manga')}>Random Manga</button>
              <button className="mt-4 text-red-500" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}

        <Link href="/discover" className={`flex flex-col items-center justify-center p-2 rounded-full ${isActive('/discover') ? 'bg-primary text-white' : 'bg-transparent text-gray-400'}`}>
          <RiCompassDiscoverLine className={`w-6 h-6 ${isActive('/discover') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors duration-200`} />
          <span className={`text-xs mt-1 ${isActive('/discover') ? 'text-white' : 'text-gray-400'}`}>Discover</span>
        </Link>

        <Link href="/schedule" className={`flex flex-col items-center justify-center ${isActive('/schedule') ? 'bg-secondary text-white' : 'text-gray-400'}`}>
          <AiOutlineCalendar className={`w-6 h-6 ${isActive('/schedule') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors duration-200`} />
          <span className={`text-xs mt-1 ${isActive('/schedule') ? 'text-white' : 'text-gray-400'}`}>Schedule</span>
        </Link>
        <div className="relative inline-block text-left">
          <div>
            <button className="flex flex-col items-center justify-center" onClick={() => sessions ? router.push('/me') : router.push('/login')}>
              {sessions ? (
                <div className="w-7 h-7 rounded-full overflow-hidden">
                  <Image
                    src={session?.user?.image || 'https://avatar.vercel.sh/1'}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
              ) : (
                <UserIcon className={`w-6 h-6 ${isActive('/login') ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors duration-200`} />
              )}
              <span className={`text-xs mt-1 ${isActive('/me') ? 'text-white' : 'text-gray-400'}`}>
                {sessions ? 'You' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
