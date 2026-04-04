import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const clipsData = [
  {
    id: 1,
    title: {
      romaji: "Anime Title 1",
      english: "Anime Title 1 English",
      native: "アニメタイトル1"
    },
    videoUrl: "url_to_video_1.mp4",
    coverImage: "url_to_image_1.jpg",
    description: "Description for Anime Title 1",
    animeId: "anime-1"
  },
  {
    id: 2,
    title: {
      romaji: "Anime Title 2",
      english: "Anime Title 2 English",
      native: "アニメタイトル2"
    },
    videoUrl: "url_to_video_2.mp4",
    coverImage: "url_to_image_2.jpg",
    description: "Description for Anime Title 2",
    animeId: "anime-2"
  }
];

export default function Clips() {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [likes, setLikes] = useState(Array(clipsData.length).fill(0));

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (direction === 'up') {
      setCurrentClipIndex((prevIndex) => (prevIndex + 1) % clipsData.length);
    } else if (direction === 'down') {
      setCurrentClipIndex((prevIndex) => 
        (prevIndex - 1 + clipsData.length) % clipsData.length
      );
    }
  };

  const handleLike = () => {
    setLikes((prevLikes) => {
      const newLikes = [...prevLikes];
      newLikes[currentClipIndex] += 1;
      return newLikes;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        handleSwipe('up');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-2xl mb-4">Anime Shorts</h1>
      <div className="relative w-full h-[80vh] overflow-hidden">
        {clipsData.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              src={clipsData[currentClipIndex].videoUrl}
              controls
              autoPlay
              loop
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-end p-4">
              <h2 className="font-semibold text-lg text-white">{clipsData[currentClipIndex].title.romaji}</h2>
              <p className="text-gray-300">{clipsData[currentClipIndex].description}</p>
              <div className="flex items-center justify-between mt-2">
                <Link href={`/anime/${clipsData[currentClipIndex].animeId}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Watch Full Anime
                </Link>
                <button onClick={handleLike} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Add to List {likes[currentClipIndex]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
