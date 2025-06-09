'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Link as LinkIcon, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBoards } from '@/contexts/BoardsContext';
import { usePinsActions } from '@/hooks/usePinsActions';
import { Pin } from '@/types';

export default function PinBuilderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { state: boardsState } = useBoards();
  const { savePinToBoard } = usePinsActions();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = () => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!imagePreview || !title.trim()) {
      alert('Please add an image and title');
      return;
    }

    setIsLoading(true);

    try {
      // Create pin object
      const newPin: Pin = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imagePreview,
        imageWidth: 400,
        imageHeight: 600,
        author: {
          id: 'user-1',
          name: 'You',
          username: 'you',
          avatar: '/placeholder-avatar.jpg',
        },
        tags,
        link: link.trim(),
        altText: altText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        saves: 0,
      };

      // Save to selected board or default board
      const boardId = selectedBoardId || boardsState.boards[0]?.id;
      if (boardId) {
        savePinToBoard(newPin, boardId);
      }

      // Redirect to boards page
      router.push('/boards');
    } catch (error) {
      console.error('Failed to save pin:', error);
      alert('Failed to save pin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Pin</h1>
        <p className="text-muted-foreground">Share your ideas with the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold">Add Image</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image or add a URL
            </p>

            {!imagePreview ? (
              <div className="space-y-4">
                {/* File Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recommendation: Use high-quality .jpg files less than 20MB
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select from computer
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>

                {/* URL Input */}
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste image URL here"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleUrlLoad} disabled={!imageUrl}>
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                    setImageUrl('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Pin Details */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-semibold">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Add your title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell everyone what your Pin is about"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Link */}
          <div>
            <Label htmlFor="link" className="text-base font-semibold">
              Link
            </Label>
            <Input
              id="link"
              placeholder="Add a destination link"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Alt Text */}
          <div>
            <Label htmlFor="altText" className="text-base font-semibold">
              Alt text
            </Label>
            <Input
              id="altText"
              placeholder="Explain what people can see in the Pin"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alt text describes your Pin for people using screen readers
            </p>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-semibold">Tags</Label>
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <div
                    key={tag}
                    className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          {/* Board Selection */}
          <div>
            <Label className="text-base font-semibold">Board</Label>
            <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a board" />
              </SelectTrigger>
              <SelectContent>
                {boardsState.boards.map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">
                  Allow comments
                </Label>
                <p className="text-sm text-muted-foreground">
                  People can comment on this Pin
                </p>
              </div>
              <Switch
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">
                  Make Pin public
                </Label>
                <p className="text-sm text-muted-foreground">
                  Anyone can see this Pin
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!imagePreview || !title.trim() || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Pin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
