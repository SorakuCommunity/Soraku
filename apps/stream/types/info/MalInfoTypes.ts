export interface MalInfoTypes {
    id: number; // MAL ID
    malId: number;
    type: string;
    format: string;
    title: Title;
    coverImage: CoverImage;
    startDate: StartDate;
    bannerImage?: string; // Optional as MALsync may not always return it
    description: string;
    episodes?: number;
    averageScore?: number;
    popularity?: number;
    status: string;
    genres: string[];
    season?: string;
    studios?: Studios;
    seasonYear?: number;
    duration?: number;
    relations?: Relations;
    characters?: Characters;
    countryOfOrigin?: string;
    mappings?: Mappings[]; // MALsync may provide mappings to external sources
  }
  
  interface Studios {
    nodes: Studio[];
  }
  
  interface Studio {
    id: number;
    name: string;
    isMain?: boolean; // Optional as MALsync may not return this
  }
  
  export interface Title {
    romaji?: string;
    english?: string;
    native?: string;
    userPreferred?: string;
  }
  
  export interface CoverImage {
    extraLarge: string;
    large: string;
    color?: string;
  }
  
  export interface StartDate {
    year?: number;
    month?: number;
    day?: number;
  }
  
  export interface Relations {
    nodes: RelationNode[];
  }
  
  export interface RelationNode {
    id: number;
    title: Title;
    format: string;
    type: string;
    status: string;
    bannerImage?: string;
    coverImage: CoverImage;
    relationType: string;
  }
  
  export interface Characters {
    nodes: CharacterNode[];
  }
  
  export interface CharacterNode {
    id: number;
    image: Image;
    name: Name;
    role?: string;
  }
  
  export interface Image {
    large: string;
    medium: string;
  }
  
  export interface Name {
    full: string;
    userPreferred: string;
  }
  
  export interface Mappings {
    id: string;
    providerId: string;
    similarity: number;
    providerType: string;
  }
  