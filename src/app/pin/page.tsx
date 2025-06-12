'use client';
import { useRouter } from 'next/navigation';
const PinPage = () => {
  const router = useRouter();
  return router.push('/');
};
export default PinPage;
