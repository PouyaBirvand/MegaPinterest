import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function ActionButtons({
  isLoading,
  canSave,
  onSave,
  onCancel,
}: {
  isLoading: boolean;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex space-x-3 pt-6">
      <Button
        variant="outline"
        className="flex-1"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        className="flex-1"
        onClick={onSave}
        disabled={!canSave || isLoading}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        Save Pin
      </Button>
    </div>
  );
}
