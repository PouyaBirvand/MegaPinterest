'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Lock, Globe } from 'lucide-react';
import { EditBoardState } from '@/types/boardPage.types';

interface EditBoardDialogProps {
  isOpen: boolean;
  editState: EditBoardState;
  onClose: () => void;
  onUpdateState: (updates: Partial<EditBoardState>) => void;
  onSave: () => void;
}

export function EditBoardDialog({
  isOpen,
  editState,
  onClose,
  onUpdateState,
  onSave,
}: EditBoardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Board name *</Label>
            <Input
              id="edit-title"
              placeholder="Board name"
              value={editState.editTitle}
              onChange={e => onUpdateState({ editTitle: e.target.value })}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              {editState.editTitle.length}/50 characters
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="What's this board about?"
              value={editState.editDescription}
              onChange={e => onUpdateState({ editDescription: e.target.value })}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {editState.editDescription.length}/200 characters
            </p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
            <div className="flex items-center space-x-3">
              {editState.editIsPrivate ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label
                  htmlFor="edit-private"
                  className="font-medium cursor-pointer"
                >
                  {editState.editIsPrivate ? 'Private board' : 'Public board'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {editState.editIsPrivate
                    ? 'Only you can see this board'
                    : 'Anyone can see this board'}
                </p>
              </div>
            </div>
            <Switch
              id="edit-private"
              checked={editState.editIsPrivate}
              onCheckedChange={editIsPrivate =>
                onUpdateState({ editIsPrivate })
              }
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={editState.isUpdating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!editState.editTitle.trim() || editState.isUpdating}
            className="flex-1"
          >
            {editState.isUpdating ? 'Updating...' : 'Update Board'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
