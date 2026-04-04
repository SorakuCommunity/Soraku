"use client";
import React, { useState, useEffect } from 'react';
import { Usernotifications } from '@/lib/AnilistUser';
import Image from 'next/image';
import { NotificationTime, formatTimeStamp } from '@/utils/TimeFunctions';
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

function Notifications({ session, nav = false }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.token) return;

            setLoading(true);
            try {
                const response = await Usernotifications(session.user.token, 1); // Fetch only the first page
                console.log('Full Response:', response);

                if (response?.notifications?.length > 0) {
                    // Filter notifications to only include those from the last 24 hours
                    const recentNotifications = response.notifications.filter(notification => {
                        const notificationDate = new Date(notification.createdAt);
                        const now = new Date();
                        const timeDiff = now - notificationDate; // Difference in milliseconds
                        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
                        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                        return minutesDiff < 60 || hoursDiff < 24 || daysDiff < 1; // Keep notifications from the last hour, day, or 24 hours
                    });
                    setNotifications(recentNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [session]);

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

    if (!nav) {
        router.push('/usernotifs'); // Redirect to notifications page if nav is false
        return null; // Prevent rendering while redirecting
    }

    return (
        <div className="min-h-screen bg-primary text-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                            <p className="text-sm text-gray-400">{NotificationTime(item.createdAt) || 'Unknown Time'}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        !loading && <p className="text-center text-xl">No notifications available.</p>
                    )}
                    {loading && <Skeleton count={1} baseColor="#2D3748" highlightColor="#4A5568" />}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
