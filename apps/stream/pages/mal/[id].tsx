import { useEffect } from "react";
import { useRouter } from "next/router";

const MalToAniListRedirect = () => {
  const router = useRouter();
  const { id } = router.query; // Changed from malId to id

  useEffect(() => {
    const fetchAniListId = async () => {
      if (id) {
        try {
          // API handling directly in this page using AniList GraphQL
          const query = `
            query ($malId: Int) {
              Media (idMal: $malId) {
                id
                type
              }
            }
          `;

          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              variables: { malId: parseInt(id as string) }, // Changed from malId to id
            }),
          });

          const data = await response.json();
          const aniListId = data?.data?.Media?.id;
          const type = data?.data?.Media?.type.toLowerCase(); // Convert type to lowercase

          if (aniListId) {
            router.push(`/${type}/${aniListId}`);
          } else {
            console.error("AniList ID not found for the given MAL ID.");
          }
        } catch (error) {
          console.error("Error fetching AniList ID:", error);
        }
      }
    };

    fetchAniListId();
  }, [id, router]); // Changed from malId to id

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <div className="max-w-md w-full p-8 bg-secondary rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-bold mb-4">Redirecting...</h1>
        <div className="text-8xl mb-6">(●'◡'●)</div>
        <p className="text-xl mb-6">
          Please wait while we're translating the MAL to AniList you requested...
        </p>
        <p className="text-lg mb-8">
          If you are not redirected, please try refreshing the page.
        </p>
      </div>
    </div>
  );
};

// API handling
export async function getServerSideProps(context: { query: { id: string } }) { // Changed from malId to id
  const { id } = context.query; // Changed from malId to id

  if (!id) {
    return {
      props: {}, // No MAL ID provided
    };
  }

  try {
    // Replace with your actual API endpoint
    const query = `
      query ($malId: Int) {
        Media (idMal: $malId) {
          id
          type
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { malId: parseInt(id) }, // Changed from malId to id
      }),
    });

    const data = await response.json();

    return {
      props: {
        aniListId: data?.data?.Media?.id || null,
        type: data?.data?.Media?.type?.toLowerCase() || null,
      },
    };
  } catch (error) {
    console.error("Error fetching AniList ID:", error);
    return {
      props: {}, // Return empty props on error
    };
  }
}

export default MalToAniListRedirect;
