'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Download, Share, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pin } from '@/types';
import { usePinsActions } from '@/hooks/usePinsActions';
import dynamic from 'next/dynamic';

interface PinCardProps {
  pin: Pin;
  onPinClick?: (pin: Pin) => void;
}

export function PinCard({ pin, onPinClick }: PinCardProps) {
  const SaveToBoardDialog = dynamic(() => import('./SaveToBoardDialog'), {
    ssr: false,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = usePinsActions();

  const isSaved = savedPins.some(p => p.id === pin.id);
  const isLiked = likedPins.includes(pin.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      unsavePin(pin.id);
    } else {
      savePin(pin);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      unlikePin(pin.id);
    } else {
      likePin(pin.id);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(pin.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pin.title || 'pin'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: pin.title,
        text: pin.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <div
        className="group relative break-inside-avoid mb-4 cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onPinClick?.(pin)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Image */}
          <div className="relative">
            {/* Loading skeleton */}
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-lg" />
            )}
            
            <Image
              src={pin.imageUrl}
              alt={pin.title}
              width={pin.imageWidth}
              height={pin.imageHeight}
              loading="lazy"
              className={`
                object-cover rounded-lg w-full h-auto
                transition-all duration-700 ease-out
                ${isLoading 
                  ? "blur-lg opacity-0 grayscale" 
                  : "blur-0 opacity-100"
                }
              `}
              onLoad={() => {
                // Add a small delay for smoother transition
                setTimeout(() => setLoading(false), 100);
              }}
            />

            {/* Hover overlay */}
            <div className={`
              absolute inset-0 bg-black/30 backdrop-blur-[1px]
              transition-all duration-300 ease-out
              ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
              {/* Top actions */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  variant={isSaved ? "default" : "secondary"}
                  onClick={handleSave}
                  className={`
                    transition-all duration-200 transform
                    ${isSaved 
                      ? 'bg-red-500 hover:bg-red-600 text-white scale-100' 
                      : 'bg-white/90 hover:bg-white text-black hover:scale-105'
                    }
                    backdrop-blur-sm shadow-lg
                  `}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>

              {/* Bottom actions */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleLike}
                    className={`
                      bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg
                      transition-all duration-200 hover:scale-110
                      ${isLiked ? 'text-red-500' : 'text-gray-700'}
                    `}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={handleDownload}
                    className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={handleShare}
                    className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 text-gray-700"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 text-gray-700"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="backdrop-blur-sm">
                    <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Save to board
                    </DropdownMenuItem>
                    <DropdownMenuItem>Hide Pin</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Report Pin</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Pin info */}
          <div className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-3 leading-relaxed">{pin.title}</h3>
            {/* Author */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-7 w-7 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={pin.author.avatar} alt={pin.author.name} />
                <AvatarFallback className="text-xs font-medium">{pin.author.name[0]}</AvatarFallback>
              </Avatar>
              <Link
                href={`/user/${pin.author.username}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {pin.author.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SaveToBoardDialog
        pin={pin}
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
      />
    </>
  );
}
