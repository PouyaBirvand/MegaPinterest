import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MasonryGrid } from '@/components/pin/MasonryGrid';
import { BoardGrid } from './BoardGrid';
import { Newspaper, NotebookPen, Pin } from 'lucide-react';
import type { ProfileTab, Board, Pin as PinType } from '@/types/profile.types';
import ProfileEmptyState from './ProfileEmptyState';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  boards: Board[];
  savedPins: PinType[];
}

export const ProfileTabs = ({
  activeTab,
  onTabChange,
  boards,
  savedPins,
}: ProfileTabsProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="mt-8">
          <ProfileEmptyState
            icon={NotebookPen}
            title="Nothing to show...yet!"
            description="Pins you create will live here."
            actionText="Create your first Pin"
            actionHref="/pin-builder"
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-8">
          {savedPins.length > 0 ? (
            <MasonryGrid pins={savedPins} />
          ) : (
            <ProfileEmptyState
              icon={Pin}
              title="No saved Pins yet"
              description="Pins you save will appear here."
              actionText="Explore ideas"
              actionHref="/explore"
            />
          )}
        </TabsContent>

        <TabsContent value="boards" className="mt-8">
          {boards.length > 0 ? (
            <BoardGrid boards={boards} />
          ) : (
            <ProfileEmptyState
              icon={Newspaper}
              title="Create your first board"
              description="Boards help you organize your Pins."
              actionText="Create board"
              actionHref="/boards"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
