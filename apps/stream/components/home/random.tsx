import UserRecommendation from './recommendation'; // Import the UserRecommendation component
import { aniListData } from "@/lib/anilist/AniList";

export async function getServerSideProps() {
  try {
    const trendingData = await aniListData({
      type: "ANIME",
      sort: "TRENDING_DESC",
      page: 1
    });

    const popularData = await aniListData({
      type: "ANIME",
      sort: "POPULARITY_DESC",
      page: 1
    });

    const upcomingData = await aniListData({
      type: "ANIME",
      sort: "START_DATE_DESC",
      page: 1
    });

    const topRatedData = await aniListData({
      type: "ANIME",
      sort: "SCORE_DESC",
      page: 1
    });

    const favouritesData = await aniListData({
      type: "ANIME",
      sort: "FAVOURITES_DESC",
      page: 1
    });

    // Combine all data into a single array
    const allData = [
      ...(trendingData.props.data || []),
      ...(popularData.props.data || []),
      ...(upcomingData.props.data || []),
      ...(topRatedData.props.data || []),
      ...(favouritesData.props.data || [])
    ];

    // Shuffle the combined data to randomize it
    const shuffledData = allData.sort(() => Math.random() - 0.5);

    // Limit the randomized data to a certain number (e.g., 5)
    const randomData = shuffledData.slice(0, 5);

    return {
      props: {
        randomData: randomData || [] // Ensure randomData is always an array
      }
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        randomData: [] // Default to an empty array on error
      }
    };
  }
}

type RandomProps = {
  randomData?: any[]; // Make randomData required
};

export default function RandomSection({ randomData = [] }: RandomProps) { // Default to an empty array if randomData is not provided
  return (
    <div className="space-y-4 lg:space-y-5 mb-5 lg:mb-10">
      <div className="px-5">
        <p className="text-sm lg:text-base">
          Powered by AI
          <br />
          <span className="font-Archivo text-[20px] lg:text-3xl font-bold">
            Random Anime 
          </span>
        </p>
      </div>
      {randomData.length > 0 ? (
        <UserRecommendation data={randomData} /> 
      ) : (
        <p className="text-center text-gray-500">No random anime data available.</p>
      )}
    </div>
  );
}