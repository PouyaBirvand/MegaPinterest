'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pin } from '@/types';

interface PinInfoProps {
  pin: Pin;
  onUserClick: (username: string) => void;
  onFollowClick: () => void;
}

export function PinInfo({ pin, onUserClick, onFollowClick }: PinInfoProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
        {pin.title}
      </h1>

      {pin.description && (
        <p className="text-lg text-muted-foreground leading-relaxed">
          {pin.description}
        </p>
      )}

      {pin.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pin.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer text-sm px-3 py-1"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
        <div className="flex items-center space-x-4">
          <Avatar
            className="h-14 w-14 ring-2 ring-white dark:ring-gray-700 cursor-pointer"
            onClick={() => onUserClick(pin.author.username)}
          >
            <AvatarImage src={pin.author.avatar} alt={pin.author.name} />
            <AvatarFallback className="font-semibold text-lg">
              {pin.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <button
              onClick={() => onUserClick(pin.author.username)}
              className="font-semibold text-lg hover:underline transition-colors text-left"
            >
              {pin.author.name}
            </button>
            <p className="text-muted-foreground">@{pin.author.username}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          onClick={onFollowClick}
        >
          Follow
        </Button>
      </div>
    </div>
  );
}
