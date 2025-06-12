'use client';

import { Calendar, Heart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Pin } from '@/types';
import Image from 'next/image';

interface PinListViewProps {
  pins: Pin[];
}

export function PinListView({ pins }: PinListViewProps) {
  return (
    <div className="space-y-4">
      {pins.map(pin => (
        <PinListItem key={pin.id} pin={pin} />
      ))}
    </div>
  );
}

interface PinListItemProps {
  pin: Pin;
}

function PinListItem({ pin }: PinListItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      <Image
        height={50}
        width={50}
        src={pin.imageUrl}
        alt={pin.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{pin.title}</h3>
        {pin.description && (
          <p className="text-muted-foreground text-sm mt-1">
            {pin.description}
          </p>
        )}
        <PinMetadata pin={pin} />
        {pin.tags && pin.tags.length > 0 && <PinTags tags={pin.tags} />}
      </div>
    </div>
  );
}

function PinMetadata({ pin }: { pin: Pin }) {
  return (
    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
      <span className="flex items-center space-x-1">
        <Calendar className="h-3 w-3" />
        <span>{new Date(pin.createdAt).toLocaleDateString()}</span>
      </span>
      {pin.likes && (
        <span className="flex items-center space-x-1">
          <Heart className="h-3 w-3" />
          <span>{pin.likes}</span>
        </span>
      )}
      {pin.views && (
        <span className="flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{pin.views}</span>
        </span>
      )}
    </div>
  );
}

function PinTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map(tag => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
