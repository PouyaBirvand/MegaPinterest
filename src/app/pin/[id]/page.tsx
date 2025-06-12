'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePinData } from '@/hooks/usePinData';
import { PinImage } from '@/components/pin/PinImage';
import { PinInfo } from '@/components/pin/PinInfo';
import { PinStatusBanner } from '@/components/pin/PinStatusBanner';
import { PinActions } from '@/components/pin/PinActions';
import { CommentsSection } from '@/components/comments/CommentsSection';
import { ImageModal } from '@/components/pin/ImageModal';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PinPage({ params }: PinPageProps) {
  const router = useRouter();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { id } = use(params);

  const {
    pin,
    comments,
    isLoading,
    error,
    isLiked,
    isSaved,
    isHidden,
    isReported,
    hideReason,
    reportReason,
    handleLike,
    handleSave,
    handleShare,
    handleDownload,
    handleHide,
    handleReport,
    handleUnhide,
    handleUndoReport,
    handleAddComment,
    handleAddReply,
    handleLikeComment,
  } = usePinData(id);

  const handleUserClick = (username: string) => {
    router.push(`/user/${username}`);
  };

  const handleFollowClick = () => {
    console.log('Follow user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="text-foreground">Loading pin...</p>
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
              ? "The pin you're looking for doesn't exist or has been removed."
              : 'There was an error loading this pin. Please try again.'}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/')}>Go Home</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

              <PinActions
                isLiked={isLiked}
                isSaved={isSaved}
                likesCount={pin.likes || 0}
                savesCount={pin.saves || 0}
                onLike={handleLike}
                onSave={handleSave}
                onShare={handleShare}
                onDownload={handleDownload}
                onHide={handleHide}
                onReport={handleReport}
                onUnhide={handleUnhide}
                onUndoReport={handleUndoReport}
                isHidden={isHidden}
                isReported={isReported}
                hideReason={hideReason}
                reportReason={reportReason}
                pin={pin}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Pins', href: '/pins' },
              { label: pin.title, href: `/pin/${pin.id}`, current: true },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Image Section */}
            <div className="order-1 lg:order-1">
              <PinImage
                imageUrl={pin.imageUrl}
                title={pin.title}
                isHidden={isHidden}
                isReported={isReported}
                onImageClick={() => setIsImageModalOpen(true)}
                onUnhide={handleUnhide}
                onUndoReport={handleUndoReport}
              />
            </div>

            {/* Content Section */}
            <div className="order-2 lg:order-2 space-y-6">
              {/* Status Banner */}
              {(isHidden || isReported) && (
                <PinStatusBanner
                  isHidden={isHidden}
                  isReported={isReported}
                  hideReason={hideReason}
                  reportReason={reportReason}
                />
              )}

              <PinInfo
                pin={pin}
                onUserClick={handleUserClick}
                onFollowClick={handleFollowClick}
              />

              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
                onLikeComment={handleLikeComment}
                onUserClick={handleUserClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={pin.imageUrl}
        title={pin.title}
      />
    </>
  );
}
