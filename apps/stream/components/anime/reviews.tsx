import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import Image from "next/image";

interface ReviewsProps {
    id: number; // Ensure the id prop is defined here
}

interface Review {
    id: number;
    summary: string;
    rating: number;
    user: {
        name: string;
        avatar: any;
      id: number; // Added user ID for linking to profile
    };
}

const Reviews: React.FC<ReviewsProps> = ({ id }) => {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]); // Specify the type for reviews
    const [loading, setLoading] = useState(true);
    const [mediaType, setMediaType] = useState<string | null>(null); // State to hold media type

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return; // Ensure ID is available

            try {
                const response = await fetch(`https://graphql.anilist.co`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query ($id: Int) {
                                Media(id: $id) {
                                    type
                                    reviews {
                                        nodes {
                                            id
                                            summary
                                            rating
                                            user {
                                                name
                                                avatar {
                                                large
                                                }
                                                id
                                            }
                                        }
                                    }
                                }
                            }
                        `,
                        variables: { id: id.toString() },
                    }),
                });

                const { data } = await response.json();
                setReviews(data.Media.reviews.nodes);
                setMediaType(data.Media.type); // Set media type
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    if (loading) return <div className="text-center py-4">Loading reviews...</div>;

    const mediaLink = mediaType ? `https://anilist.co/${mediaType}/${id}/reviews` : '#'; // Construct the link based on media type

    return (
        <div className="reviews-container p-4 bg-primary rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">User Reviews</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews available for this title.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((review) => (
                        <li key={review.id} className="review-item p-4 bg-secondary rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                {review.user.avatar && (
                                    <Image 
                                        src={review.user.avatar.large} 
                                        alt={`${review.user.name}'s profile`} 
                                        className="w-10 h-10 rounded-full mr-3" 
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">
                                        <a href={`/profile/${review.user.name}`} className="hover:underline">
                                            @{review.user.name}
                                        </a>
                                    </p>
                                    <p className="mt-2">"{review.summary}"</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-4">
                <a href={mediaLink} className="text-blue-500 hover:underline">
                    Read more reviews on AniList
                </a>
            </div>
        </div>
    );
};

export default Reviews;
