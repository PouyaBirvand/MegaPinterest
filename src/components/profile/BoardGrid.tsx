import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Board } from '@/types/profile.types';
import { Newspaper } from 'lucide-react';

interface BoardGridProps {
  boards: Board[];
}

export const BoardGrid = ({ boards }: BoardGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {boards.map(board => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
};

const BoardCard = ({ board }: { board: Board }) => (
  <Card className="group hover:shadow-lg transition-shadow">
    <CardHeader className="p-0">
      <Link href={`/boards/${board.id}`}>
        <BoardPreview board={board} />
      </Link>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-lg mb-1">{board.title}</CardTitle>
      <CardDescription>{board.pins.length} pins</CardDescription>
    </CardContent>
  </Card>
);

const BoardPreview = ({ board }: { board: Board }) => (
  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
    {board.pins.length > 0 ? (
      <div className="grid grid-cols-2 gap-1 h-full">
        {board.pins.slice(0, 4).map(pin => (
          <Image
            key={pin.id}
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-full object-cover"
            width={150}
            height={150}
          />
        ))}
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <span className="text-4xl text-muted-foreground">
          <Newspaper />
        </span>
      </div>
    )}
  </div>
);
