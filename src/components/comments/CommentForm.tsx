'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export function CommentForm({
  onSubmit,
  placeholder = 'Add a comment...',
  buttonText = 'Post Comment',
}: CommentFormProps) {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <p className="text-muted-foreground mb-4 text-lg">
          Sign in to add comments
        </p>
        <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
      <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="font-medium">{user.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-3">
        <Textarea
          placeholder={placeholder}
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          onKeyDown={handleKeyDown}
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Press Cmd+Enter to post
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
