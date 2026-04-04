import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';

interface ShareModalProps {
    visible: boolean;
    onClose: () => void;
    animeId: string;
    isManga: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, animeId, isManga }) => {
    const link = `https://1anime.ink/${isManga ? 'm' : 'a'}/${animeId}`;
    const [copyButtonText, setCopyButtonText] = useState('Copy Link');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleShare = (platform: string) => {
        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(link)}`;
                break;
            default:
                break;
        }
        window.open(shareUrl, '_blank');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopyButtonText('Copied');
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopyButtonText('Copy Link'), 2000);
    };

    return (
        <Dialog open={visible} onClose={onClose}>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <div className="fixed inset-0 flex items-center justify-center p-6">
                <Dialog.Panel className="bg-secondary rounded-lg shadow-lg p-8 max-w-md w-full">
                    <Dialog.Title className="text-xl font-semibold text-center mb-4">Share this Anime/Manga</Dialog.Title>
                    {loading ? (
                        <div className="animate-pulse">
                            <Skeleton height={20} className="mb-2" />
                            <Skeleton height={20} className="mb-2" />
                            <Skeleton height={20} className="mb-2" />
                        </div>
                    ) : (
                        <>
                            <div className="mt-4 flex items-center">
                                <input type="text" value={link} readOnly className="border border-gray-300 rounded-lg p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <button onClick={handleCopy} className="ml-2 bg-blue-600 text-white p-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200">
                                    <FaCopy className="mr-1" /> {copyButtonText}
                                </button>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button onClick={() => handleShare('facebook')} className="flex-1 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-700 transition duration-200 mr-2">
                                    <FaFacebook className="mr-1" /> Share
                                </button>
                                <button onClick={() => handleShare('twitter')} className="flex-1 bg-blue-400 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-500 transition duration-200 mx-2">
                                    <FaTwitter className="mr-1" /> Share
                                </button>
                                <button onClick={() => handleShare('linkedin')} className="flex-1 bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-800 transition duration-200">
                                    <FaLinkedin className="mr-1" /> Share
                                </button>
                            </div>
                        </>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ShareModal;
