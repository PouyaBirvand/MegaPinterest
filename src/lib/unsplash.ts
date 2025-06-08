import { Pin } from '@/types';

const UNSPLASH_ACCESS_KEY = 'MMKsADJIAAf6GPX7bB1zYmhaToWer7GLKP2djjjslVg';
const BASE_URL = 'https://api.unsplash.com';

interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  width: number;
  height: number;
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  created_at: string;
  color: string;
  tags?: Array<{ title: string }>;
}

function transformUnsplashPhoto(photo: UnsplashPhoto): Pin {
  return {
    id: photo.id,
    title: photo.alt_description || photo.description || 'Untitled',
    description: photo.description,
    imageUrl: photo.urls.regular,
    imageWidth: photo.width,
    imageHeight: photo.height,
    author: {
      name: photo.user.name,
      avatar: photo.user.profile_image.medium,
      username: photo.user.username,
    },
    tags: photo.tags?.map(tag => tag.title) || [],
    likes: photo.likes,
    saves: Math.floor(Math.random() * 1000), // Mock data
    createdAt: photo.created_at,
    color: photo.color,
  };
}

export async function fetchPins(page = 1, perPage = 30): Promise<Pin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/photos?page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch pins');
    }
    
    const photos: UnsplashPhoto[] = await response.json();
    return photos.map(transformUnsplashPhoto);
  } catch (error) {
    console.error('Error fetching pins:', error);
    throw error;
  }
}

export async function searchPins(
  query: string,
  page = 1,
  perPage = 30,
  orientation?: string,
  color?: string
): Promise<{ pins: Pin[]; totalPages: number }> {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      per_page: perPage.toString(),
      client_id: UNSPLASH_ACCESS_KEY!,
    });

    if (orientation && orientation !== 'all') {
      params.append('orientation', orientation);
    }
    
    if (color) {
      params.append('color', color);
    }

    const response = await fetch(`${BASE_URL}/search/photos?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to search pins');
    }
    
    const data = await response.json();
    return {
      pins: data.results.map(transformUnsplashPhoto),
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error('Error searching pins:', error);
    throw error;
  }
}

export async function getRandomPins(count = 30): Promise<Pin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/photos/random?count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch random pins');
    }
    
    const photos: UnsplashPhoto[] = await response.json();
    return photos.map(transformUnsplashPhoto);
  } catch (error) {
    console.error('Error fetching random pins:', error);
    throw error;
  }
}
