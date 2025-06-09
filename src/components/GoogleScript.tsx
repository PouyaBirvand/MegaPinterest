'use client';

import Script from 'next/script';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export function GoogleScript() {
  const { initializeGoogleAuth } = useGoogleAuth();

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      onLoad={initializeGoogleAuth}
      strategy="afterInteractive"
    />
  );
}
