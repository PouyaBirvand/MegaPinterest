'use client';
import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Download,
  Share,
  MoreHorizontal,
  Plus,
  Eye,
  Bookmark,
  EyeOff,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Pin } from '@/types';
import { usePinsActions } from '@/hooks/usePinsActions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import PinOverlay from '../PinOverlay';

const SaveToBoardDialog = dynamic(() => import('./SaveToBoardDialog'), {
  ssr: false,
  loading: () => null,
});

const ReportPinDialog = dynamic(() => import('../ReportPinDialog'), {
  ssr: false,
  loading: () => null,
});

// در بخش imports اضافه کن:
const HidePinDialog = dynamic(() => import('../HidePinDialog'), {
  ssr: false,
  loading: () => null,
});

interface PinCardProps {
  pin: Pin;
  priority?: boolean;
  onSave?: (pin: Pin) => void;
  onLike?: (pinId: string) => void;
  onHide?: (pinId: string) => void;
  onReport?: (pinId: string) => void;
}

export const PinCard = memo(function PinCard({
  pin,
  priority = false,
  onSave,
  onLike,
  onHide,
  onReport,
}: PinCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showHideDialog, setShowHideDialog] = useState(false);

  const {
    savedPins,
    likedPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    hidePin,
    reportPin,
    isPinHidden,
    isPinReported,
    unhidePin,
    undoReportPin,
    getHideReason,
    getReportReason,
  } = usePinsActions();

  const isHidden = isPinHidden(pin.id);
  const isReported = isPinReported(pin.id);
  const hideReason = getHideReason(pin.id);
  const reportReason = getReportReason(pin.id);

  const handleUnhide = () => {
    unhidePin(pin.id);
  };

  const handleUndoReport = () => {
    undoReportPin(pin.id);
  };

  const isSaved = savedPins.some(p => p.id === pin.id);
  const isLiked = likedPins.includes(pin.id);

  // Memoized handlers
  const handlePinClick = useCallback(() => {
    router.push(`/pin/${pin.id}`);
  }, [router, pin.id]);

  const handleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        if (toast && toast.error) {
          toast.error('Please sign in to save pins');
        } else {
          alert('Please sign in to save pins');
        }
        router.push('/auth/signin');
        return;
      }

      try {
        if (isSaved) {
          unsavePin(pin.id);
          if (toast && toast.success) {
            toast.success('Pin removed from saved');
          } else {
            console.log('Pin unsaved');
          }
        } else {
          savePin(pin);
          if (toast && toast.success) {
            toast.success('Pin saved successfully');
          } else {
            console.log('Pin saved');
          }
        }
        if (onSave) {
          onSave(pin);
        }
      } catch (error) {
        if (toast && toast.error) {
          toast.error('Failed to save pin');
        } else {
          console.error('Save failed:', error);
        }
      }
    },
    [user, isSaved, pin, savePin, unsavePin, onSave, router]
  );

  const handleLike = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        if (toast && toast.error) {
          toast.error('Please sign in to like pins');
        } else {
          alert('Please sign in to like pins');
        }
        router.push('/auth/signin');
        return;
      }

      try {
        if (isLiked) {
          unlikePin(pin.id);
        } else {
          likePin(pin.id);
        }
        if (onLike) {
          onLike(pin.id);
        }
      } catch (error) {
        if (toast && toast.error) {
          toast.error('Failed to like pin');
        } else {
          console.error('Like failed:', error);
        }
      }
    },
    [user, isLiked, pin.id, likePin, unlikePin, onLike, router]
  );

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isDownloading) return;
      setIsDownloading(true);

      try {
        const response = await fetch(pin.imageUrl, {
          mode: 'cors',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pin.title ? pin.title.replace(/[^a-z0-9]/gi, '_') : 'pin'}.jpg`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);

        if (toast && toast.success) {
          toast.success('Image downloaded successfully');
        } else {
          console.log('Downloaded');
        }
      } catch (error) {
        console.error('Download failed:', error);
        if (toast && toast.error) {
          toast.error('Failed to download image');
        } else {
          alert('Download failed');
        }
      } finally {
        setIsDownloading(false);
      }
    },
    [pin.imageUrl, pin.title, isDownloading]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const shareData = {
        title: pin.title,
        text: pin.description,
        url: `${window.location.origin}/pin/${pin.id}`,
      };

      try {
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.url);
          if (toast && toast.success) {
            toast.success('Link copied to clipboard');
          } else {
            alert('Link copied!');
          }
        }
      } catch (error) {
        console.error('Share failed:', error);
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareData.url);
          if (toast && toast.success) {
            toast.success('Link copied to clipboard');
          } else {
            alert('Link copied!');
          }
        } catch (clipboardError) {
          if (toast && toast.error) {
            toast.error('Failed to share');
          } else {
            alert('Share failed');
          }
        }
      }
    },
    [pin.title, pin.description, pin.id]
  );

  const handleSaveToBoardClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        if (toast && toast.error) {
          toast.error('Please sign in to save to boards');
        } else {
          alert('Please sign in');
        }
        router.push('/auth/signin');
        return;
      }
      setTimeout(() => {
        setShowSaveDialog(true);
      }, 50);
    },
    [user, router]
  );

  const handleHidePin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        if (toast && toast.error) {
          toast.error('Please sign in to hide pins');
        } else {
          alert('Please sign in to hide pins');
        }
        router.push('/auth/signin');
        return;
      }
      setShowHideDialog(true);
    },
    [user, router]
  );

  const handleHideSubmit = useCallback(
    (reason: string, feedback?: string) => {
      try {
        hidePin(pin.id, reason, feedback);
        if (toast && toast.success) {
          toast.success('Pin hidden successfully');
        } else {
          console.log('Pin hidden');
        }
        if (onHide) {
          onHide(pin.id);
        }
        setShowHideDialog(false);
      } catch (error) {
        console.error('Hide failed:', error);
        if (toast && toast.error) {
          toast.error('Failed to hide pin');
        }
      }
    },
    [pin.id, hidePin, onHide]
  );

  const handleReportPin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        if (toast && toast.error) {
          toast.error('Please sign in to report pins');
        } else {
          alert('Please sign in to report');
        }
        router.push('/auth/signin');
        return;
      }
      setShowReportDialog(true);
    },
    [user, router]
  );

  const handleReportSubmit = useCallback(
    (reason: string, description?: string) => {
      try {
        reportPin(pin.id, reason, description);
        if (toast && toast.success) {
          toast.success('Pin reported successfully');
        } else {
          console.log('Pin reported');
        }
        if (onReport) {
          onReport(pin.id);
        }
        setShowReportDialog(false);
      } catch (error) {
        console.error('Report failed:', error);
        if (toast && toast.error) {
          toast.error('Failed to report pin');
        }
      }
    },
    [pin.id, reportPin, onReport]
  );

  const handleImageLoad = useCallback(() => {
    setTimeout(() => setLoading(false), 150);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setLoading(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <>
      <PinOverlay
        isHidden={isHidden}
        isReported={isReported}
        onUnhide={handleUnhide}
        onUndoReport={handleUndoReport}
        hideReason={hideReason}
        reportReason={reportReason}
        className="w-full"
      >
        <article
          className="group relative break-inside-avoid mb-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handlePinClick}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePinClick();
            }
          }}
          aria-label={`View pin: ${pin.title}`}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500">
            {/* Image Container */}
            <div className="relative">
              {/* Loading skeleton */}
              {isLoading && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded-2xl" />
              )}

              {/* Error state */}
              {imageError ? (
                <div className="aspect-[3/4] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Image unavailable</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={pin.imageUrl}
                  alt={pin.title || 'Pin image'}
                  width={pin.imageWidth || 300}
                  height={pin.imageHeight || 400}
                  loading={priority ? 'eager' : 'lazy'}
                  priority={priority}
                  className={`
                  object-cover rounded-2xl w-full h-auto
                  transition-all duration-700 ease-out
                  ${
                    isLoading
                      ? 'blur-lg opacity-0 grayscale scale-110'
                      : 'blur-0 opacity-100 scale-100'
                  }
                `}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              )}

              {/* Hover overlay with improved animations */}
              <div
                className={`
                absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
                backdrop-blur-[2px] rounded-2xl
                transition-all duration-500 ease-out
                ${
                  isHovered
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }
              `}
              >
                {/* Top actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant={isSaved ? 'default' : 'secondary'}
                    onClick={handleSave}
                    className={`
                    transition-all duration-300 transform hover:scale-110
                    ${
                      isSaved
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                        : 'bg-white/95 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm'
                    }
                    font-semibold px-4 py-2 rounded-full
                  `}
                    disabled={!user && !isSaved}
                  >
                    {isSaved ? (
                      <>
                        <Bookmark className="h-4 w-4 mr-1 fill-current" />
                        Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>

                {/* Bottom actions */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleLike}
                      className={`
                      bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg
                      transition-all duration-300 hover:scale-110 rounded-full
                                            ${isLiked ? 'text-red-500 shadow-red-500/25' : 'text-gray-700 hover:text-red-500'}
                    `}
                      disabled={!user}
                      aria-label={isLiked ? 'Unlike pin' : 'Like pin'}
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                          isLiked ? 'fill-current scale-110' : 'hover:scale-110'
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 text-gray-700 hover:text-blue-600 rounded-full"
                      aria-label="Download image"
                    >
                      <Download
                        className={`h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleShare}
                      className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 text-gray-700 hover:text-green-600 rounded-full"
                      aria-label="Share pin"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* More options dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 text-gray-700 rounded-full"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl"
                      sideOffset={8}
                    >
                      <DropdownMenuItem
                        onClick={handleSaveToBoardClick}
                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Save to board</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleHidePin}
                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <EyeOff className="h-4 w-4" />
                        <span>Hide Pin</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleReportPin}
                        className="flex items-center space-x-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Flag className="h-4 w-4" />
                        <span>Report Pin</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* View indicator */}
                <div className="absolute top-4 left-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </div>
                </div>
              </div>
            </div>

            {/* Pin info */}
            <div className="p-5 space-y-4">
              <h3 className="font-semibold text-base line-clamp-2 leading-relaxed text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {pin.title || 'Untitled Pin'}
              </h3>

              {/* Description preview */}
              {pin.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {pin.description}
                </p>
              )}

              {/* Tags preview */}
              {pin.tags && pin.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pin.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  {pin.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{pin.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Author info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-gray-100 dark:ring-gray-800 hover:ring-blue-200 dark:hover:ring-blue-700 transition-all duration-200 cursor-pointer">
                    <AvatarImage
                      src={pin.author.avatar}
                      alt={pin.author.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {pin.author.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/user/${pin.author.username}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    {pin.author.name}
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                  {isLiked && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <Heart className="h-3 w-3 fill-current" />
                      <span>Liked</span>
                    </div>
                  )}
                  {isSaved && (
                    <div className="flex items-center space-x-1 text-blue-500">
                      <Bookmark className="h-3 w-3 fill-current" />
                      <span>Saved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loading overlay */}
            {isLoading && !imageError && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </article>
      </PinOverlay>

      {/* Save to Board Dialog */}
      {showSaveDialog && (
        <SaveToBoardDialog
          pin={pin}
          open={showSaveDialog}
          onOpenChange={open => {
            if (!open) {
              setShowSaveDialog(false);
            }
          }}
        />
      )}

      {/* Report Pin Dialog */}
      {showReportDialog && (
        <ReportPinDialog
          pin={pin}
          open={showReportDialog}
          onOpenChange={open => {
            if (!open) {
              setShowReportDialog(false);
            }
          }}
          onReport={handleReportSubmit}
        />
      )}
      {showHideDialog && (
        <HidePinDialog
          pin={pin}
          open={showHideDialog}
          onOpenChange={open => {
            if (!open) {
              setShowHideDialog(false);
            }
          }}
          onHide={handleHideSubmit}
        />
      )}
    </>
  );
});

PinCard.displayName = 'PinCard';
export { PinCard };
