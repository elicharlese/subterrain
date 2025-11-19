export type MusicProvider = 'apple' | 'spotify' | 'youtube' | 'tidal' | 'soundcloud';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audioUrl?: string;
  provider: MusicProvider;
  providerId: string; // ID from the provider's API
  coverImage?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  provider: MusicProvider;
  providerId: string;
  coverImage?: string;
  owner?: string;
}

export interface MusicProviderConfig {
  name: string;
  icon: string;
  requiresAuth: boolean;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  currentIndex: number;
}

export interface MusicProviderSDK {
  searchTracks(query: string): Promise<Track[]>;
  getTrack(id: string): Promise<Track>;
  getPlaylist(id: string): Promise<Playlist>;
  getUserPlaylists(): Promise<Playlist[]>;
  authenticate(): Promise<void>;
  isAuthenticated(): boolean;
}