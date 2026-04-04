export type MalSearchAdvanceTypes = {
    total: number;
    lastPage: number;
    results: Array<{
      id: string;  // MAL ID
      malId: string;
      coverImage: string;
      bannerImage?: string; // Optional in some cases
      status: string;
      title: {
        native?: string;
        romaji?: string;
        english?: string;
      };
      duration?: number;
      mappings?: Array<{
        id: string;
        providerId: string;
        similarity: number;
        providerType: string;
      }>;
      synonyms?: Array<string>;
      countryOfOrigin?: string;
      description?: string;
      color?: string;
      year: number;
      rating?: {
        mal: number;
      };
      popularity?: {
        mal: number;
      };
      type: string;
      format: string;
      relations?: Array<{
        id: string;
        type: string;
        title: {
          native?: string;
          romaji?: string;
          english?: string;
        };
        format: string;
        relationType: string;
      }>;
      totalChapters?: number;
      totalVolumes?: number;
      genres: Array<string>;
      tags?: Array<string>;
      averageRating: number;
      averagePopularity: number;
      artwork?: Array<{
        img: string;
        type: string;
        providerId: string;
      }>;
      characters?: Array<{
        name: string;
        image: string;
        voiceActor?: {
          name?: string;
          image?: string;
        };
      }>;
    }>;
  };
  export type MalSearchAdvanceParams = {
    search?: string;
    type?: string; 
    genres?: { type: string; value: string }[]; 
    page?: number;
    sort?: string; 
    format?: string; 
    season?: string;
    seasonYear?: number;
    perPage?: number;
};