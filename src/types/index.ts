export interface Pin {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    author: {
      name: string;
      avatar: string;
      username: string;
    };
    boardId?: string;
    tags: string[];
    likes: number;
    saves: number;
    createdAt: string;
    color?: string;
  }
  
  export interface Board {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    pins: Pin[];
    isPrivate: boolean;
    createdAt: string;
  }
  
  export interface User {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    followers: number;
    following: number;
    boards: Board[];
  }
  
  export interface SearchFilters {
    query: string;
    color?: string;
    orientation?: 'all' | 'landscape' | 'portrait' | 'square';
    category?: string;
  }
  