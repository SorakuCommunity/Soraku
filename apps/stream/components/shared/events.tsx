import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";

// Define the events data
const events = [
  {
    title: "New Themes!",
    date: "2024",
    imageUrl: "https://example.com/image1.jpg",
    link: "/event1",
    width: 800,  // Add appropriate width
    height: 450  // Add appropriate height
  },
  {
    title: "Welcome to 1Anime 2.0",
    date: "2024",
    imageUrl: "https://example.com/image2.jpg",
    link: "/event2",
    width: 800,  // Add appropriate width
    height: 450  // Add appropriate height
  }
];

export default function Events() {
  const [isOpen, setIsOpen] = useState(false);
  const completeButtonRef = useRef(null);

  useEffect(() => {
    // Check if events have been viewed
    const eventsViewed = localStorage.getItem("eventsViewed");
    setIsOpen(!eventsViewed); // Open modal only if not viewed
  }, []);
  
  function closeModal() {
    localStorage.setItem("eventsViewed", "true"); // Save to localStorage
    setIsOpen(false); // Close modal
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeModal}
          initialFocus={completeButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-100 mb-4"
                  >
                    Events
                  </Dialog.Title>

                  {events.map((event) => (
                    <div key={event.title} className="mb-6">
                      <Link href={event.link} onClick={closeModal}>
                        <Image 
                          src={event.imageUrl} 
                          alt={event.title} 
                          width={event.width} 
                          height={event.height} 
                          className="w-full h-auto rounded-lg mb-2" 
                        />
                        <h4 className="text-xl font-semibold text-gray-100">{event.title} <span className="text-sm text-gray-400">({event.date})</span></h4>
                      </Link>
                    </div>
                  ))}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      onClick={closeModal}
                      ref={completeButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
