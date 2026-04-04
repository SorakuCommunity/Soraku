import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RandomAnimeRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchRandomAnimeId = async () => {
      const randomChoice = Math.random() < 0.5; // 50/50 chance
      let query;

      if (randomChoice) {
        // Fetch trending anime
        query = `
          query {
            Page(page: 1, perPage: 100) {
              media(type: ANIME, sort: TRENDING_DESC) {
                id
              }
            }
          }
        `;
      } else {
        // Fetch completely random anime
        query = `
          query {
            Page(page: 1, perPage: 10000) {
              media(type: ANIME) {
                id
              }
            }
          }
        `;
      }

      const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const { data } = await response.json();
      if (data && data.Page.media.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.Page.media.length);
        const randomAnimeId = data.Page.media[randomIndex].id;
        router.push(`/anime/${randomAnimeId}`);
      } else {
        console.error("Failed to fetch anime");
      }
    };

    fetchRandomAnimeId();
  }, [router]);

  return null; // Render nothing as we are redirecting
};

export default RandomAnimeRedirect;



