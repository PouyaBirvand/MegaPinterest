import { Label } from '@/components/ui/label';
import { SelectItem } from '@/components/ui/select';
import { Board } from '@/types';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

export default function BoardSelection({
  selectedBoardId,
  boards,
  onBoardChange,
}: {
  selectedBoardId: string;
  boards: Board[];
  onBoardChange: (boardId: string) => void;
}) {
  return (
    <div>
      <Label className="text-base font-semibold">Board</Label>
      <Select value={selectedBoardId} onValueChange={onBoardChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Choose a board" />
        </SelectTrigger>
        <SelectContent>
          {boards.map(board => (
            <SelectItem key={board.id} value={board.id}>
              {board.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
