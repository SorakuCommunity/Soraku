import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: "AniListProvider",
      name: "AniList",
      type: "oauth",
      token: "https://anilist.co/api/v2/oauth/token",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      userinfo: {
        url: process.env.GRAPHQL_ENDPOINT,
        async request(context) {
          try {
            const response = await fetch("https://graphql.anilist.co", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${context.tokens.access_token}`,
              },
              body: JSON.stringify({
                query: `
                query {
                    Viewer {
                        id
                        name
                        avatar {
                            large
                            medium
                        }
                        bannerImage
                        mediaListOptions {
                            animeList {
                                customLists
                            }
                        }
                    }
                }
                `,
              }),
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const { data } = await response.json();

            if (!data || !data.Viewer) {
              throw new Error("Failed to fetch user data");
            }

            const userLists = data.Viewer.mediaListOptions.animeList.customLists || [];
            let custLists = userLists;

            if (!userLists.includes("Watched using 1Anime")) {
              custLists.push("Watched using 1Anime");
              const fetchGraphQL = async (query: string, variables: { lists: any }) => {
                const response = await fetch("https://graphql.anilist.co/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    ...(context.tokens.access_token && {
                      Authorization: `Bearer ${context.tokens.access_token}`,
                    }),
                  },
                  body: JSON.stringify({ query, variables }),
                });
                return response.json();
              };

              const customLists = async (lists: any) => {
                const setList = `
                    mutation($lists: [String]){
                        UpdateUser(animeListOptions: { customLists: $lists }){
                            id
                        }
                    }
                `;
                const data = await fetchGraphQL(setList, { lists });
                return data;
              };

              await customLists(custLists);
            }

            return {
              token: context.tokens.access_token,
              name: data.Viewer.name,
              sub: data.Viewer.id,
              image: data.Viewer.avatar?.medium,
              list: data.Viewer.mediaListOptions.animeList.customLists,
            };
          } catch (error) {
            console.error("Error fetching user info:", error);
            throw new Error("User info fetch failed");
          }
        },
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile) {
        return {
          token: profile.token,
          id: profile.sub,
          name: profile?.name,
          image: profile.image,
          list: profile?.list,
          version: "1.0.1",
        };
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - User:", user);
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/login',  
    signOut: '/login', 
  },
};

export default NextAuth(authOptions);
