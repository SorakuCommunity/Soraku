// lib/fetchTrending.js
import fetch from 'node-fetch';

const ANILIST_API_URL = 'https://graphql.anilist.co';

export const fetchTrendingAnime = async () => {
  const query = `
    query {
      Page {
        media(sort: TRENDING_DESC, perPage: 10) {
          id
          title {
            romaji
          }
          siteUrl
          updatedAt
        }
      }
    }
  `;

  const response = await fetch(ANILIST_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.Page.media;
};