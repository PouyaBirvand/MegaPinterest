'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Lock, Globe, Loader2 } from 'lucide-react';

interface EditBoardDialogProps {
  open: boolean;
  title: string;
  description: string;
  isPrivate: boolean;
  isUpdating: boolean;
  onOpenChange: (open: boolean) => void;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPrivateChange: (isPrivate: boolean) => void;
  onSubmit: () => void;
}

export function EditBoardDialog({
  open,
  title,
  description,
  isPrivate,
  isUpdating,
  onOpenChange,
  onTitleChange,
  onDescriptionChange,
  onPrivateChange,
  onSubmit,
}: EditBoardDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit board</DialogTitle>
          <DialogDescription>Make changes to your board</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Name</Label>
            <Input
              id="edit-title"
              placeholder="Board name"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              disabled={isUpdating}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea
              id="edit-description"
              placeholder="What's your board about?"
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
              disabled={isUpdating}
              rows={3}
            />
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {isPrivate ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="edit-privacy" className="text-sm font-medium">
                  Keep this board secret
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isPrivate
                    ? 'Only you can see this board'
                    : 'Anyone can see this board'}
                </p>
              </div>
            </div>
            <Switch
              id="edit-privacy"
              checked={isPrivate}
              onCheckedChange={onPrivateChange}
              disabled={isUpdating}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
