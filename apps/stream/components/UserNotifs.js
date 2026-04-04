"use client";
import React, { useState, useEffect } from 'react';
import { Usernotifications } from '@/lib/AnilistUser';
import Image from 'next/image';
import { NotificationTime, formatTimeStamp } from '@/utils/TimeFunctions';
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { signIn } from 'next-auth/react';

function Notifications({ session, nav = false }) { // Added nav prop
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.token) return;

            setLoading(true);
            try {
                const response = await Usernotifications(session.user.token, page);
                console.log('Full Response:', response);

                if (response?.pageInfo) {
                    setHasNextPage(response.pageInfo.hasNextPage);
                }

                if (response?.notifications?.length > 0) {
                    const newNotifications = response.notifications;

                    setNotifications(prevNotifications => {
                        const allNotifications = [...prevNotifications, ...newNotifications];
                        const uniqueNotifications = new Map(allNotifications.map(item => [item.id, item]));
                        return Array.from(uniqueNotifications.values());
                    });
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [page, session]);

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center h-screen bg-primary">
                <div className="text-center bg-secondary p-8 rounded-lg shadow-lg">
                    <p className="text-xl mb-6 text-gray-300">Please login to view notifications</p>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
                        onClick={() => signIn('AniListProvider')}
                    >
                        <Image alt="anilist-icon" loading="lazy" width="20" height="20" src="/svg/anilist-icon.svg" className="mr-2" />
                        Login with AniList
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary text-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {!nav && ( // Conditional rendering based on nav prop
                        <div className="lg:col-span-1">
                            <div className="bg-secondary rounded-lg shadow-lg p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <Image src={session?.user?.image} alt="User Image" width={80} height={80} className="rounded-full" />
                                    <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                                </div>
                                <p className="text-sm text-gray-400 mb-4">Joined on: {formatTimeStamp(session?.user?.createdAt) || 'Invalid Date'}</p>
                                {session?.user?.list?.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Custom Lists</h3>
                                        <ul className="list-disc list-inside text-sm text-gray-300">
                                            {session.user.list.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map((item, index) => {
                                    const title = item?.media?.title?.english || item?.media?.title?.romaji || 'Untitled';
                                    const mediaType = item.media?.type?.toLowerCase() || 'anime';
                                    const mediaId = item.media?.id;
                                    
                                    let context = item?.context || '';
                                    if (!context) {
                                        if (item.type === 'AIRING') {
                                            context = `${title} released new episodes`;
                                        } else if (item.type === 'MEDIA_DATA_CHANGE') {
                                            context = `${title} has been updated`;
                                        } else if (item.type === 'MEDIA_DELETION') {
                                            context = `${title} has been removed from the site`;
                                        } else if (item.type === 'MEDIA_MERGE') {
                                            context = `${title} has been merged with another entry`;
                                        } else {
                                            context = `New update for ${title}`;
                                        }
                                    }

                                    return (
                                        <Link href={mediaId ? `/${mediaType}/${mediaId}` : '#'} key={index}>
                                            <div className="bg-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex items-center space-x-4">
                                                {item.media?.coverImage?.large ? (
                                                    <Image
                                                        src={item.media.coverImage.large}
                                                        alt="Notification Image"
                                                        width={60}
                                                        height={60}
                                                        className="rounded-md"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                ) : (
                                                    <div className="w-[60px] h-[60px] bg-gray-700 rounded-md"></div>
                                                )}
                                                <div>
                                                    <p className="text-lg font-semibold">{context}</p>
                                                    <p className="text-sm text-gray-400">{NotificationTime(item.createdAt) || 'Invalid Date'}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                !loading && <p className="text-center text-xl">No notifications available.</p>
                            )}
                            {loading && <Skeleton count={5} baseColor="#2D3748" highlightColor="#4A5568" />}
                            {hasNextPage && !loading && (
                                <button 
                                    onClick={() => setPage(prevPage => prevPage + 1)} 
                                    className="w-full mt-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition duration-300"
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notifications;