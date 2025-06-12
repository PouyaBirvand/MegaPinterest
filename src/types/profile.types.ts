export interface UserStats {
  boards: number;
  pins: number;
  followers: number;
  following: number;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

export interface Board {
  id: string;
  title: string;
  pins: Pin[];
}

export interface Pin {
  id: string;
  title: string;
  imageUrl: string;
}

export type ProfileTab = 'created' | 'saved' | 'boards';
