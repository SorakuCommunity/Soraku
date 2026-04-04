import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

// Define the interface for download links
interface DownloadLink {
    quality: string;
    link: string;
}

// Function to fetch download links
const fetchDownloadLinks = async (epId: string): Promise<DownloadLink[]> => {
    const response = await fetch(`/api/v2/etc/download/${epId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch download links');
    }
    const data = await response.json();
    // Map the new API response to the expected format
    return data.map((item: { source: string; link: string }) => ({
        quality: item.source.split('(')[1].trim().replace(')', ''), // Extract quality from source
        link: item.link
    }));
};

const DownloadModal: React.FC<{ isOpen: boolean; onRequestClose: () => void; epId: string }> = ({ isOpen, onRequestClose, epId }) => {
    const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // State to track loading
    const [error, setError] = useState<string | null>(null); // State to track error message

    const loadDownloadLinks = async () => {
        setLoading(true); // Set loading to true when fetching starts
        setError(null); // Reset error state
        try {
            const links = await fetchDownloadLinks(epId);
            setDownloadLinks(links);
        } catch (error) {
            console.error(error);
            setError("Failed to fetch download links, Try again later or contact support. This only works for Gogoanime Servers.");
        } finally {
            setLoading(false); // Set loading to false when fetching ends
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            loadDownloadLinks();
        }
    }, [isOpen, epId]);

    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onRequestClose}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-80" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-secondary shadow-lg rounded-lg">
                            <h2 className="text-xl font-bold">Download Anime</h2>
                            {loading ? ( // Show loading if fetching
                                <div className="mt-4 space-y-3">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="h-6 bg-gray-300 animate-pulse rounded-md"></div>
                                    ))}
                                </div>
                            ) : error ? ( // Show error message if there is an error
                                <div className="mt-4 text-red-500">{error}</div>
                            ) : (
                                <ul className="mt-4 space-y-3">
                                    {downloadLinks.map((link: DownloadLink, index: number) => (
                                        <li key={index}>
                                            <button 
                                                onClick={() => window.open(link.link, "_blank")} 
                                                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition duration-200"
                                            >
                                               Download {link.quality}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={onRequestClose} className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200">Close</button>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

// Add default export for DownloadModal
export default DownloadModal;  // {{ edit_1 }}
