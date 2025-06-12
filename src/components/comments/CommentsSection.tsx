'use client';

import { MessageCircle } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { CommentsList } from './CommentsList';
import type { Comment } from '@/types/comment.types';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onUserClick: (username: string) => void;
}

export function CommentsSection({
  comments,
  onAddComment,
  onAddReply,
  onLikeComment,
  onUserClick,
}: CommentsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MessageCircle className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
      </div>

      <CommentForm onSubmit={onAddComment} />

      <CommentsList
        comments={comments}
        onAddReply={onAddReply}
        onLikeComment={onLikeComment}
        onUserClick={onUserClick}
      />
    </div>
  );
}
