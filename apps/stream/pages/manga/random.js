import { useEffect } from 'react';
import { useRouter } from 'next/router';

const RandomMangaRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchRandomMangaId = async () => {
      const randomChoice = Math.random() < 0.5; // 50/50 chance
      let query;

      if (randomChoice) {
        // Fetch trending manga
        query = `
          query {
            Page(page: 1, perPage: 100) {
              media(type: MANGA, sort: TRENDING_DESC) {
                id
              }
            }
          }
        `;
      } else {
        // Fetch completely random manga
        query = `
          query {
            Page(page: 1, perPage: 10000) {
              media(type: MANGA) {
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
        const randomMangaId = data.Page.media[randomIndex].id;
        router.push(`/manga/${randomMangaId}`);
      } else {
        console.error("Failed to fetch manga");
      }
    };

    fetchRandomMangaId();
  }, [router]);

  return null; // Render nothing as we are redirecting
};

export default RandomMangaRedirect;
