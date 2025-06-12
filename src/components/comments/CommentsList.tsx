'use client';

import { MessageCircle } from 'lucide-react';
import { CommentItem } from './CommentItem';
import type { Comment } from '@/types/comment.types';

interface CommentsListProps {
  comments: Comment[];
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onUserClick: (username: string) => void;
}

export function CommentsList({
  comments,
  onAddReply,
  onLikeComment,
  onUserClick,
}: CommentsListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-xl text-muted-foreground mb-2">No comments yet</p>
        <p className="text-muted-foreground">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => {
        if (!comment || !comment.user) {
          return null;
        }

        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            onAddReply={onAddReply}
            onLikeComment={onLikeComment}
            onUserClick={onUserClick}
          />
        );
      })}
    </div>
  );
}
