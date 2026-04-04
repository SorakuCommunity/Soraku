import UserRecommendation from './recommendation'; // Import the UserRecommendation component

// Sample custom data for the featured section
const customData = [
  {
    id: 1,
    title: {
      userPreferred: "Featured Title 1",
      english: "Featured Title 1 English",
    },
    description: "This is a description for featured title 1.",
    type: "ANIME",
    coverImage: {
      extraLarge: "/path/to/featured-image1.jpg",
    },
    bannerImage: "/path/to/featured-banner1.jpg",
  },
  {
    id: 2,
    title: {
      userPreferred: "Featured Title 2",
      english: "Featured Title 2 English",
    },
    description: "This is a description for featured title 2.",
    type: "MANGA",
    coverImage: {
      extraLarge: "/path/to/featured-image2.jpg",
    },
    bannerImage: "/path/to/featured-banner2.jpg",
  },
  // Add more items as needed
];

export default function FeaturedSection() {
  return (
    <div className="space-y-4 lg:space-y-5 mb-5 lg:mb-10">
      <div className="px-5">
        <p className="text-sm lg:text-base">
          Editor's Choice
          <br />
          <span className="font-Archivo text-[20px] lg:text-3xl font-bold">
            Featured on 1Anime
          </span>
        </p>
      </div>
      <UserRecommendation data={customData} />
    </div>
  );
}