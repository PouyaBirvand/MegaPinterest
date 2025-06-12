'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
      <div className="h-8 w-8 rounded-full bg-red-white flex items-center justify-center">
        <Image alt="logo" src="/favicon.png" width={32} height={32} />
      </div>
      <span className="font-bold text-xl hidden sm:block">Pinterest</span>
    </Link>
  );
}
