'use client';
import { useRouter } from 'next/navigation';
export default function PinPage() {
  const router = useRouter();
  return router.push('/');
};
