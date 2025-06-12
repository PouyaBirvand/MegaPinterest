import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MasonryGrid } from '@/components/pin/MasonryGrid';
import { SavedPinsList } from '@/components/pin/SavedPinsList';
import { ViewMode } from '@/types/saved.types';
import { Pin } from '@/types';

interface SavedContentProps {
  pins: Pin[];
  viewMode: ViewMode;
  selectionMode: boolean;
  selectedPins: string[];
  onSelectPin: (pinId: string) => void;
}

export function SavedContent({
  pins,
  viewMode,
  selectionMode,
  selectedPins,
  onSelectPin,
}: SavedContentProps) {
  return (
    <Tabs value={viewMode} className="w-full">
      <TabsContent value="grid">
        <MasonryGrid
          pins={pins}
          selectionMode={selectionMode}
          selectedPins={selectedPins}
          onSelectPin={onSelectPin}
        />
      </TabsContent>
      <TabsContent value="list">
        <SavedPinsList
          pins={pins}
          selectionMode={selectionMode}
          selectedPins={selectedPins}
          onSelectPin={onSelectPin}
        />
      </TabsContent>
    </Tabs>
  );
}
