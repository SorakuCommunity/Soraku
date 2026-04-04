import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router'; // Import useRouter

export default function ShortcutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  function handleCommandSubmit(e: React.FormEvent) {
    e.preventDefault();
    switch (command) {
      case 'h':
        // Navigate to home
        router.push('/');
        break;
      case 's':
        // Open search
        router.push('/search/anime');
        break;
      case 'r':
        // Refresh the page
        window.location.reload();
        break;
      case 'ra':
        // Fetch random anime
        const randomAnimeNumber = Math.floor(Math.random() * 9000); // Assuming 1000 is the max number
        router.push(`/anime/${randomAnimeNumber}`);
        break;
      case 'rm':
        // Fetch random manga
        const randomMangaNumber = Math.floor(Math.random() * 9000); // Assuming 1000 is the max number
        router.push(`/manga/${randomMangaNumber}`);
        break;
      default:
        console.log('Unknown command');
    }
    setCommand('');
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[7000]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white flex justify-between items-center"
                >
                  Command Prompt
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>
                <div className="mt-4">
                  <form onSubmit={handleCommandSubmit}>
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      className="w-full p-2 rounded bg-secondary text-white"
                      placeholder="Type a command..."
                    />
                  </form>
                  <div className="mt-2 text-white">
                    <p>Commands:</p>
                    <p> $ h - home</p>
                    <p> $ s - search</p>
                    <p> $ r - refresh</p>
                    <p> $ ra - random anime</p>
                    <p> $ rm - random manga</p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}