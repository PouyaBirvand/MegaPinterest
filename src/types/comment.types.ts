export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  user: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
  };
  replies?: Comment[];
}
