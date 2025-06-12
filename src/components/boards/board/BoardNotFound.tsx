import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BoardNotFoundProps {
  onBackClick: () => void;
}

export function BoardNotFound({ onBackClick }: BoardNotFoundProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Edit className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Board not found</h1>
        <p className="text-muted-foreground mb-6">
          This board might have been deleted or doesn't exist.
        </p>
        <Button onClick={onBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to boards
        </Button>
      </div>
    </div>
  );
}
