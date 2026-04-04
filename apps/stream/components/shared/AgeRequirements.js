import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AgeVerificationModal({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
          static
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-90 backdrop-filter backdrop-blur-md" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all border-2 transform bg-gray-900 shadow-xl rounded-md">
                <div className="flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400" aria-hidden="true" />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-white text-center"
                >
                  Age Verification Required
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-white text-center">
                    Warning: The content you are about to view contains mature themes and is intended for adults only. 
                    By proceeding, you confirm that you are at least 18 years old or the legal age in your jurisdiction.
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors duration-200"
                    onClick={closeModal}
                  >
                    I confirm I am 18 or older
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}