import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PinSettings({
  allowComments,
  isPublic,
  onAllowCommentsChange,
  onIsPublicChange,
}: {
  allowComments: boolean;
  isPublic: boolean;
  onAllowCommentsChange: (value: boolean) => void;
  onIsPublicChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Allow comments</Label>
          <p className="text-sm text-muted-foreground">
            People can comment on this Pin
          </p>
        </div>
        <Switch
          checked={allowComments}
          onCheckedChange={onAllowCommentsChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Make Pin public</Label>
          <p className="text-sm text-muted-foreground">
            Anyone can see this Pin
          </p>
        </div>
        <Switch checked={isPublic} onCheckedChange={onIsPublicChange} />
      </div>
    </div>
  );
}
