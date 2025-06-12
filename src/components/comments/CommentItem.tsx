'use client';

import { useState } from 'react';
import { Heart, Reply } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommentForm } from './CommentForm';
import { formatTimeAgo } from '@/lib/utils';
import type { Comment } from '@/types/comment.types';

interface CommentItemProps {
  comment: Comment;
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onUserClick: (username: string) => void;
}

export function CommentItem({
  comment,
  onAddReply,
  onLikeComment,
  onUserClick,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);

  if (!comment?.user) {
    return null;
  }

  const handleReply = (text: string) => {
    onAddReply(comment.id, text);
    setIsReplying(false);
  };

  const userName = comment.user.name || 'Unknown User';
  const userAvatar = comment.user.avatar || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      {/* Main Comment */}
      <div className="flex space-x-4">
        <Avatar
          className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800 cursor-pointer"
          onClick={() => onUserClick(userName.toLowerCase())}
        >
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="font-medium">{userInitial}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onUserClick(userName.toLowerCase())}
              className="font-semibold hover:underline"
            >
              {userName}
            </button>
            <span className="text-sm text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>

          <p className="leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            {comment.text}
          </p>

          <div className="flex items-center space-x-6 pt-2">
            <button
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                comment.isLiked
                  ? 'text-red-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart
                className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`}
              />
              <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 space-y-2">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Write a reply..."
                buttonText="Reply"
              />
              <Button
                variant="ghost"
                onClick={() => setIsReplying(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-16 space-y-4 border-l-2 border-gray-100 dark:border-gray-800 pl-6">
          {comment.replies.map(reply => {
            if (!reply?.user) {
              return null;
            }

            const replyUserName = reply.user.name || 'Unknown User';
            const replyUserAvatar = reply.user.avatar || '';
            const replyUserInitial = replyUserName.charAt(0).toUpperCase();

            return (
              <div key={reply.id} className="flex space-x-3">
                <Avatar
                  className="h-10 w-10 ring-1 ring-gray-100 dark:ring-gray-800 cursor-pointer"
                  onClick={() => onUserClick(replyUserName.toLowerCase())}
                >
                  <AvatarImage src={replyUserAvatar} alt={replyUserName} />
                  <AvatarFallback className="text-sm font-medium">
                    {replyUserInitial}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUserClick(replyUserName.toLowerCase())}
                      className="font-semibold text-sm hover:underline"
                    >
                      {replyUserName}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(reply.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    {reply.text}
                  </p>

                  <div className="flex items-center space-x-4 pt-1">
                    <button
                      onClick={() => onLikeComment(reply.id)}
                      className={`flex items-center space-x-1 text-xs transition-colors ${
                        reply.isLiked
                          ? 'text-red-500'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart
                        className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`}
                      />
                      <span>{reply.likes > 0 ? reply.likes : 'Like'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
