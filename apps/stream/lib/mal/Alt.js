export async function altData({ sort, page = 1 }) {
    const resMALsync = await fetch(`https://api.malsync.moe/mal/anime/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($page: Int, $perPage: Int, $sort: String) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media(sort: $sort) {
                malId
                title {
                  romaji
                  english
                }
                bannerImage
                coverImage {
                  extraLarge
                  color
                }
                description
              }
            }
          }
        `,
        variables: {
          page: page,
          perPage: 15,
          sort,
        },
      }),
    });
    
    const malData = await resMALsync.json();
    const data = malData.data.Page.media;
  
    return {
      props: {
        data,
      },
    };
  }
  