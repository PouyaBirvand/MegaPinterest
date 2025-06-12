'use client';

import { BoardPageContent } from '@/components/boards/board/BoardPageContent';
import { use } from 'react';

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);

  return <BoardPageContent boardId={id} />;
}
