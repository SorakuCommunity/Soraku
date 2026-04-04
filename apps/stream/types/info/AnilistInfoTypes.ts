export interface AniListInfoTypes {
  mediaListEntry: MediaListEntry;
  id: number;
  idMal: number;
  type: string;
  format: string;
  title: Title;
  coverImage: CoverImage;
  startDate: StartDate;
  bannerImage: string;
  description: string;
  episodes: any;
  nextAiringEpisode: any;
  averageScore: number;
  popularity: number;
  status: string;
  genres: string[];
  season: any;
  studios: Studios;
  seasonYear: any;
  duration: any;
  relations: Relations;
  recommendations: Recommendations;
  characters: CharacterConnection; // Updated to use CharacterConnection
  trailer: Trailer;
  countryOfOrigin: string;
  notifications: Notification[]; // Updated to use Notification[]
  isAdult: boolean;
}

interface Studios {
  edges: Studio[];
}

interface Studio {
  isMain: boolean;
  node: Node4;
}

interface Node4 {
  id: number;
  name: string;
}

export interface MediaListEntry {
  status: string;
  progress: number;
  progressVolumes: number;
}

export interface Title {
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  color: string;
}

export interface StartDate {
  year: number;
  month: number;
}

export interface Relations {
  edges: Edge[];
}

export interface Edge {
  id: number;
  relationType: string;
  node: Node;
}

export interface Node {
  id: number;
  idMal: number;
  title: Title2;
  format: string;
  type: string;
  status: string;
  bannerImage?: string;
  coverImage: CoverImage2;
}

export interface Title2 {
  userPreferred: string;
}

export interface CoverImage2 {
  extraLarge: string;
  color: string;
}

export interface Recommendations {
  nodes: Node2[];
}

export interface Node2 {
  mediaRecommendation: MediaRecommendation;
}

export interface MediaRecommendation {
  id: number;
  title: Title3;
  coverImage: CoverImage3;
}

export interface Title3 {
  romaji: string;
}

export interface CoverImage3 {
  extraLarge: string;
  large: string;
}

export interface CharacterConnection { // Updated interface for characters
  edges: CharacterEdge[];
}

export interface CharacterEdge { // Updated edge interface for characters
  role: string;
  node: CharacterNode; // Updated to use CharacterNode
  voiceActorRoles?: VoiceActorRole[]; // Added voiceActorRoles
}

export interface CharacterNode { // Updated node interface for characters
  id: number;
  image: CharacterImage; // Updated to use CharacterImage
  name: CharacterName; // Updated to use CharacterName
}

export interface CharacterImage { // Updated image interface for characters
  large: string;
  medium: string;
}

export interface CharacterName { // Updated name interface for characters
  full: string;
  userPreferred: string;
}

export interface VoiceActorRole { // New interface for voice actor roles
  voiceActor: VoiceActor; // Added voiceActor
}

export interface VoiceActor { // New interface for voice actors
  id: number;
  name: VoiceActorName; // Updated to use VoiceActorName
  image: VoiceActorImage; // Updated to use VoiceActorImage
}

export interface VoiceActorName { // New interface for voice actor names
  first: string;
  middle?: string;
  last: string;
  full: string;
  native: string;
  userPreferred: string;
}

export interface VoiceActorImage { // New interface for voice actor images
  large: string;
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface Notification { // Updated interface for notifications
  context: string;
  createdAt: number;
}