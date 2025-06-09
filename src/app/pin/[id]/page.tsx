'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Download, Share, Send, MessageCircle, Reply, X, ZoomIn, ZoomOut, RotateCw, Maximize2, MoreHorizontal, EyeOff, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { fetchPinById } from '@/lib/unsplash';
import PinOverlay from '@/components/PinOverlay';
import HidePinDialog from '@/components/HidePinDialog';
import ReportPinDialog from '@/components/ReportPinDialog';

interface Comment {
  id: string;
  user: { id: string; name: string; avatar: string };
  text: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}


function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  title
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsFullscreen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(prev + 0.25, 5));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(prev - 0.25, 0.25));
          break;
        case '0':
          e.preventDefault();
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          setRotation(0);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          setIsFullscreen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.25, Math.min(5, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title?.replace(/[^a-z0-9]/gi, '_') || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${isFullscreen ? 'max-w-full max-h-full w-screen h-screen' : 'max-w-7xl max-h-[95vh]'} 
          p-0 bg-black/95 backdrop-blur-md border-0 overflow-hidden
        `}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </Button>
              <h3 className="text-white font-medium truncate max-w-md">
                {title}
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={zoom <= 0.25}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                {Math.round(zoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(prev => Math.min(prev + 0.25, 5))}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={zoom >= 5}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(prev => !prev)}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={downloadImage}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={imageUrl}
              alt={title}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain select-none"
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              onClick={resetView}
              className="text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Reset View
            </Button>

            <div className="text-white text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              Use mouse wheel to zoom • Drag to pan • Press R to rotate • Press F for fullscreen
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PinPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const pinId = params.id as string;

  const [pin, setPin] = useState<Pin | null>(null);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // اضافه کردن state های جدید برای hide/report
  const [showHideDialog, setShowHideDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const {
    savedPins,
    likedPins,
    savePin,
    unsavePin,
    likePin,
    unlikePin,
    likeComment,
    addComment,
    addReply,
    getComments,
    getPinById,
    // اضافه کردن functions جدید
    hidePin,
    reportPin,
    isPinHidden,
    isPinReported,
    unhidePin,
    undoReportPin,
    getHideReason,
    getReportReason
  } = usePinsActions();

  const handleHidePin = (reason: string) => {
    if (!pin) return;
    hidePin(pin.id, reason);
    setShowHideDialog(false);
  };

  const handleReportPin = (reason: string, description?: string) => {
    if (!pin) return;
    reportPin(pin.id, reason, description);
    setShowReportDialog(false);
  };

  const handleUnhidePin = () => {
    if (!pin) return;
    unhidePin(pin.id);
  };

  const handleUndoReport = () => {
    if (!pin) return;
    undoReportPin(pin.id);
  };


  const memoizedGetComments = useCallback(getComments, []);

  const loadPin = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let foundPin = getPinById(id);

      if (foundPin) {
        setPin(foundPin);
        setComments(memoizedGetComments(id));
        setIsLoading(false);
        return;
      }
      try {
        foundPin = await fetchPinById(id);
        if (foundPin) {
          setPin(foundPin);
          setComments(memoizedGetComments(id));

          // Pin رو در localStorage ذخیره کن برای دفعات بعد
          const cachedPins = JSON.parse(localStorage.getItem('cachedPins') || '{}');
          cachedPins[id] = foundPin;
          localStorage.setItem('cachedPins', JSON.stringify(cachedPins));
        } else {
          setError('Pin not found');
        }
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Failed to load pin');
      }
    } catch (error) {
      console.error('Load pin error:', error);
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [getPinById, memoizedGetComments]);

  useEffect(() => {
    if (pinId) {
      loadPin(pinId);
    }
  }, [pinId, loadPin]);

  const handleImageClick = useCallback(() => {
    setShowImageModal(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600">Loading pin...</p>
        </div>
      </div>
    );
  }

  if (error || !pin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Pin not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Pin not found'
              ? 'The pin you\'re looking for doesn\'t exist or has been removed.'
              : 'There was an error loading this pin. Please try again.'
            }
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/')}>
              Go Home
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSaved = savedPins.some(p => p.id === pin.id);
  const isLiked = likedPins.includes(pin.id);
  const isHidden = isPinHidden(pin.id);
  const isReported = isPinReported(pin.id);
  const hideReason = getHideReason(pin.id);
  const reportReason = getReportReason(pin.id);
  const handleSave = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (isSaved) {
      unsavePin(pin.id);
    } else {
      savePin(pin);
    }
  };

  const handleLike = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (isLiked) {
      unlikePin(pin.id);
    } else {
      likePin(pin.id);
    }
  };

  const handleDownload = async () => {
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

  const handleShare = () => {
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

  const handleAddComment = () => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (comment.trim()) {
      const updatedComments = addComment(pin.id, {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.image
        },
        text: comment
      });
      setComments(updatedComments);
      setComment('');
    }
  };

  const handleAddReply = (commentId: string) => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (replyText.trim()) {
      const updatedComments = addReply(pin.id, commentId, {
        user: {
          id: user.id,
          name: user.name,
          avatar: user.image
        },
        text: replyText
      });
      setComments(updatedComments);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string) => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    const updatedComments = likeComment(pin.id, commentId);
    setComments(updatedComments);
  };

  const handleUserClick = (username: string) => {
    router.push(`/user/${username}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleLike}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${isLiked ? 'text-red-500' : ''
                    }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDownload}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Download className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleShare}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Share className="h-5 w-5" />
                </Button>

                {/* اضافه کردن More Options Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isHidden ? (
                      <DropdownMenuItem onClick={handleUnhidePin}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Unhide Pin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => setShowHideDialog(true)}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Pin
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {isReported ? (
                      <DropdownMenuItem onClick={handleUndoReport}>
                        <Flag className="h-4 w-4 mr-2" />
                        Undo Report
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setShowReportDialog(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Report Pin
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={handleSave}
                  variant={isSaved ? "default" : "outline"}
                  className={`${isSaved
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Image Section با PinOverlay */}
            <div className="order-1 lg:order-1">
              <div className="sticky top-24">
                <PinOverlay
                  isHidden={isHidden}
                  isReported={isReported}
                  onUnhide={handleUnhidePin}
                  onUndoReport={handleUndoReport}
                  className="w-full"
                >
                  <div className="relative bg-gradient-to-br bg-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
                    {/* Loading skeleton */}
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
                    )}

                    <div
                      className="relative aspect-auto min-h-[400px] lg:min-h-[800px] flex items-center justify-center cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <Image
                        src={pin.imageUrl}
                        alt={pin.title}
                        fill
                        className={`
                          object-contain transition-all !rounded-2xl duration-700 ease-out p-4
                          group-hover:scale-105
                          ${isImageLoading
                            ? "blur-lg scale-110 opacity-0"
                            : "blur-0 scale-100 opacity-100"
                          }
                        `}
                        priority
                        onLoad={() => {
                          setTimeout(() => setIsImageLoading(false), 150);
                        }}
                      />

                      {/* Hover overlay for image */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                    </div>

                    {/* Click to view indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to view full size
                    </div>
                  </div>
                </PinOverlay>
              </div>
            </div>

            {/* Content Section - باقی کد همون قبلی */}
            <div className="order-2 lg:order-2 space-y-6">
              {/* نمایش وضعیت pin در بالای محتوا */}
              {(isHidden || isReported) && (
                <div className="p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-800/50">
                  {isHidden && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <EyeOff className="h-4 w-4" />
                      <span className="text-sm">This pin is hidden</span>
                      {hideReason && <span className="text-xs">• {hideReason}</span>}
                    </div>
                  )}
                  {isReported && (
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <Flag className="h-4 w-4" />
                      <span className="text-sm">This pin has been reported</span>
                      {reportReason && <span className="text-xs">• {reportReason}</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Pin Info */}
              <div className="space-y-6">
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{pin.title}</h1>

                {pin.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{pin.description}</p>
                )}

                {/* Tags */}
                {pin.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pin.tags.map((tag) => (
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

                {/* Author */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      className="h-14 w-14 ring-2 ring-white dark:ring-gray-700 cursor-pointer"
                      onClick={() => handleUserClick(pin.author.username)}
                    >
                      <AvatarImage src={pin.author.avatar} alt={pin.author.name} />
                      <AvatarFallback className="font-semibold text-lg">{pin.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <button
                        onClick={() => handleUserClick(pin.author.username)}
                        className="font-semibold text-lg hover:underline transition-colors text-left"
                      >
                        {pin.author.name}
                      </button>
                      <p className="text-muted-foreground">
                        @{pin.author.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    onClick={() => !user && router.push('/auth/signin')}
                  >
                    Follow
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
                </div>

                {/* Add Comment */}
                {user ? (
                  <div className="flex space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="font-medium">{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleAddComment();
                          }
                        }}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Press Cmd+Enter to post
                        </p>
                        <Button
                          onClick={handleAddComment}
                          disabled={!comment.trim()}
                          className="transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                    <p className="text-muted-foreground mb-4 text-lg">Sign in to add comments</p>
                    <Button
                      onClick={() => router.push('/auth/signin')}
                    >
                      Sign In
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-xl text-muted-foreground mb-2">No comments yet</p>
                      <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        {/* Main Comment */}
                        <div className="flex space-x-4">
                          <Avatar
                            className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800 cursor-pointer"
                            onClick={() => handleUserClick(comment.user.name.toLowerCase())}
                          >
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback className="font-medium">{comment.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleUserClick(comment.user.name.toLowerCase())}
                                className="font-semibold hover:underline"
                              >
                                {comment.user.name}
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
                                onClick={() => handleLikeComment(comment.id)}
                                className={`flex items-center space-x-2 text-sm transition-colors ${comment.isLiked
                                    ? 'text-red-500'
                                    : 'text-muted-foreground hover:text-foreground'
                                  }`}
                              >
                                <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                                <span>{comment.likes > 0 ? comment.likes : 'Like'}</span>
                              </button>
                              <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Reply className="h-4 w-4" />
                                <span>Reply</span>
                              </button>
                            </div>

                            {/* Reply Input */}
                            {replyingTo === comment.id && user && (
                              <div className="flex space-x-3 mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.image} />
                                  <AvatarFallback className="text-sm">{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                  <Textarea
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="min-h-[80px] text-sm resize-none"
                                  />
                                  <div className="flex space-x-3">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddReply(comment.id)}
                                      disabled={!replyText.trim()}
                                      className="h-9"
                                    >
                                      Reply
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyText('');
                                      }}
                                      className="h-9"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-16 space-y-4 border-l-2 border-gray-100 dark:border-gray-800 pl-6">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex space-x-3">
                                <Avatar
                                  className="h-10 w-10 ring-1 ring-gray-100 dark:ring-gray-800 cursor-pointer"
                                  onClick={() => handleUserClick(reply.user.name.toLowerCase())}
                                >
                                  <AvatarImage src={reply.user.avatar} />
                                  <AvatarFallback className="text-sm font-medium">{reply.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleUserClick(reply.user.name.toLowerCase())}
                                      className="font-semibold text-sm hover:underline"
                                    >
                                      {reply.user.name}
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
                                      onClick={() => handleLikeComment(reply.id)}
                                      className={`flex items-center space-x-1 text-xs transition-colors ${reply.isLiked
                                          ? 'text-red-500'
                                          : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                      <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                                      <span>{reply.likes > 0 ? reply.likes : 'Like'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={pin.imageUrl}
        title={pin.title}
      />

      {/* Hide Pin Dialog */}
      <HidePinDialog
        pin={pin}
        open={showHideDialog}
        onOpenChange={setShowHideDialog}
        onHide={handleHidePin}
      />
      {/* Report Pin Dialog */}
      <ReportPinDialog
        pin={pin}
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onReport={handleReportPin}
      />

    </>
  );
}