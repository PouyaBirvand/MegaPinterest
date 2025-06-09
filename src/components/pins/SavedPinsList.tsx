'use client';

import { useState } from 'react';
import { Pin } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  Bookmark,
  MoreVertical,
  ExternalLink,
  Download,
  Share2,
  Trash2,
  Tag,
  Eye
} from 'lucide-react';
import { usePinsActions } from '@/contexts/PinsContext';
import Image from 'next/image';

interface SavedPinsListProps {
  pins: Pin[];
  selectionMode?: boolean;
  selectedPins?: string[];
  onSelectPin?: (pinId: string) => void;
}

export function SavedPinsList({
  pins,
  selectionMode = false,
  selectedPins = [],
  onSelectPin,
}: SavedPinsListProps) {
  const { unsavePin } = usePinsActions();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const toggleDescription = (pinId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pinId)) {
        newSet.delete(pinId);
      } else {
        newSet.add(pinId);
      }
      return newSet;
    });
  };

  const handleDownload = async (pin: Pin) => {
    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pin.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async (pin: Pin) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title,
          text: pin.description,
          url: pin.sourceUrl || window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(pin.sourceUrl || window.location.href);
    }
  };

  return (
    <div className="space-y-4">
      {pins.map((pin) => (
        <Card key={pin.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex">
            {/* Selection Checkbox */}
            {selectionMode && (
              <div className="flex items-center p-4">
                <Checkbox
                  checked={selectedPins.includes(pin.id)}
                  onCheckedChange={() => onSelectPin?.(pin.id)}
                />
              </div>
            )}

            {/* Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 relative overflow-hidden">
                <Image
                  src={pin.imageUrl}
                  alt={pin.title}
                  width={50}
                  height={50}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(pin.sourceUrl, '_blank')}
                />
                {pin.sourceUrl && (
                  <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(pin.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {pin.title}
                    </CardTitle>
                    
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">

                      {pin.likes && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{pin.likes} likes</span>
                        </div>
                      )}

                      {pin.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{pin.views} views</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {pin.tags && pin.tags.length > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {pin.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {pin.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pin.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(pin)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(pin)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      {pin.sourceUrl && (
                        <DropdownMenuItem onClick={() => window.open(pin.sourceUrl, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Source
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => unsavePin(pin.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove from Saved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {/* Description */}
              {pin.description && (
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    {expandedDescriptions.has(pin.id) ? (
                      <>
                        {pin.description}
                        {pin.description.length > 150 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto ml-2 text-xs"
                            onClick={() => toggleDescription(pin.id)}
                          >
                            Show less
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {pin.description.length > 150 
                          ? `${pin.description.substring(0, 150)}...`
                          : pin.description
                        }
                        {pin.description.length > 150 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto ml-2 text-xs"
                            onClick={() => toggleDescription(pin.id)}
                          >
                            Show more
                          </Button>
                        )}
                      </>
                    )}
                  </CardDescription>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(pin)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(pin)}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => unsavePin(pin.id)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Unsave
                    </Button>
                  </div>
                </CardContent>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}