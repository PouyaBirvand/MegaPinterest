'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Download, Share, MoreHorizontal, Send, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Pin } from '@/types';
import { usePinsActions } from '@/hooks/usePinsActions';

interface PinModalProps {
    pin: Pin | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PinModal({ pin, open, onOpenChange }: PinModalProps) {
    const [comment, setComment] = useState('');
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [comments, setComments] = useState([
        {
            id: '1',
            user: { name: 'John Doe', avatar: '/placeholder-avatar.jpg' },
            text: 'Amazing shot! Love the composition.',
            createdAt: '2 hours ago',
        },
        {
            id: '2',
            user: { name: 'Jane Smith', avatar: '/placeholder-avatar.jpg' },
            text: 'This is so inspiring! 😍',
            createdAt: '1 day ago',
        },
    ]);

    const { savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = usePinsActions();

    if (!pin) return null;

    const isSaved = savedPins.some(p => p.id === pin.id);
    const isLiked = likedPins.includes(pin.id);

    const handleSave = () => {
        if (isSaved) {
            unsavePin(pin.id);
        } else {
            savePin(pin);
        }
    };

    const handleLike = () => {
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
        if (comment.trim()) {
            const newComment = {
                id: Date.now().toString(),
                user: { name: 'You', avatar: '/placeholder-avatar.jpg' },
                text: comment,
                createdAt: 'now',
            };
            setComments([newComment, ...comments]);
            setComment('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-white dark:bg-gray-900 overflow-auto">
                <div className="flex flex-col lg:flex-row h-full min-h-[80vh]">
                    {/* Image Section */}
                    <div className="flex-1 relative bg-black flex items-center justify-center min-h-[50vh] lg:min-h-full">
                        {/* Loading skeleton */}
                        {isImageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
                        )}
                        
                        <Image
                            src={pin.imageUrl}
                            alt={pin.title}
                            width={pin.imageWidth}
                            height={pin.imageHeight}
                            className={`
                                max-w-full max-h-full object-contain
                                transition-all duration-700 ease-out
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

                        {/* Close button */}
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                            </Button> */}

{/* Image overlay actions */}
<div className="absolute bottom-4 left-4 flex space-x-2 lg:hidden">
    <Button
        size="icon"
        variant="ghost"
        onClick={handleLike}
        className={`
            bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 hover:scale-110
            ${isLiked ? 'text-red-500' : 'text-white'}
        `}
    >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
    <Button 
        size="icon" 
        variant="ghost" 
        onClick={handleDownload}
        className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
    >
        <Download className="h-5 w-5" />
    </Button>
    <Button 
        size="icon" 
        variant="ghost" 
        onClick={handleShare}
        className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110"
    >
        <Share className="h-5 w-5" />
    </Button>
</div>
</div>

{/* Content Section */}
<div className="w-full lg:w-[420px] flex flex-col bg-background border-l border-border">
{/* Header */}
<div className="p-6 border-b border-border">
    <div className="flex items-center justify-between mb-6 mt-6">
        <div className="hidden lg:flex space-x-2">
            <Button
                size="icon"
                variant="ghost"
                onClick={handleLike}
                className={`
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110
                    ${isLiked ? 'text-red-500' : ''}
                `}
            >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleDownload}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            >
                <Download className="h-5 w-5" />
            </Button>
            <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleShare}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            >
                <Share className="h-5 w-5" />
            </Button>
            <Button 
                size="icon" 
                variant="ghost"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            >
                <MoreHorizontal className="h-5 w-5" />
            </Button>
        </div>
        <Button
            onClick={handleSave}
            variant={isSaved ? "default" : "outline"}
            className={`
                transition-all duration-200 hover:scale-105
                ${isSaved 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }
            `}
        >
            {isSaved ? 'Saved' : 'Save'}
        </Button>
    </div>

    {/* Pin Info */}
    <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{pin.title}</h1>
        
        {pin.description && (
            <p className="text-muted-foreground leading-relaxed">{pin.description}</p>
        )}

        {/* Tags */}
        {pin.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {pin.tags.slice(0, 6).map((tag) => (
                    <Badge 
                        key={tag} 
                        variant="secondary"
                        className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                        #{tag}
                    </Badge>
                ))}
            </div>
        )}

        {/* Author */}
        <div className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-700">
                <AvatarImage src={pin.author.avatar} alt={pin.author.name} />
                <AvatarFallback className="font-semibold">{pin.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <Link
                    href={`/user/${pin.author.username}`}
                    className="font-semibold hover:underline transition-colors"
                >
                    {pin.author.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                    @{pin.author.username}
                </p>
            </div>
            <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
                Follow
            </Button>
        </div>
    </div>
</div>

{/* Comments Section */}
<div className="flex-1 flex flex-col overflow-y-auto">
    <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Comments ({comments.length})</h3>
        </div>

        {/* Add Comment */}
        <div className="flex space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarFallback className="font-medium">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
                <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleAddComment();
                        }
                    }}
                />
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        Press Cmd+Enter to post
                    </p>
                    <Button
                        onClick={handleAddComment}
                        size="sm"
                        disabled={!comment.trim()}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Post
                    </Button>
                </div>
            </div>
        </div>
    </div>

    {/* Comments List */}
    <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-4">
            {comments.length === 0 ? (
                <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No comments yet</p>
                    <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 group">
                        <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback className="font-medium">{comment.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-sm">{comment.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {comment.createdAt}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                                {comment.text}
                            </p>
                            <div className="flex space-x-4 pt-1">
                                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    Like
                                </button>
                                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </ScrollArea>
</div>
</div>
</div>
</DialogContent>
</Dialog>
);
}