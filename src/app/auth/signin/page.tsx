'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

function SignInContent() {
  const { user, isLoading, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { initializeGoogleAuth, renderGoogleButton, signInWithGoogle } =
    useGoogleAuth();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    const clientId =
      '794859400910-c57np2s6sl21j8hpo17ojiir6e1kislo.apps.googleusercontent.com';
    console.log('Environment Client ID:', clientId);
    if (!clientId) {
      setError('Google Client ID is not configured');
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.push(callbackUrl);
    }
  }, [user, router, callbackUrl]);

  useEffect(() => {
    const clientId =
      '794859400910-c57np2s6sl21j8hpo17ojiir6e1kislo.apps.googleusercontent.com';
    if (!clientId) {
      console.error('Google Client ID is missing');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google script loaded');
      initializeGoogleAuth();
      setTimeout(() => {
        if (googleButtonRef.current) {
          renderGoogleButton('google-signin-button');
        }
      }, 500);
    };
    script.onerror = () => {
      console.error('Failed to load Google script');
      setError('Failed to load Google authentication');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [initializeGoogleAuth, renderGoogleButton]);

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setError(null);
    signInWithGoogle();
    setTimeout(() => setIsGoogleLoading(false), 3000);
  };

  const handleManualTest = () => {
    const testUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      image: '/placeholder-avatar-2.png',
    };
    signIn(testUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/favicon.png" alt="Pinterest" width={48} height={48} />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Pinterest
          </CardTitle>
          <CardDescription>
            Sign in to save and organize your favorite ideas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          {/* Google Sign In Button */}
          <div id="google-signin-button" ref={googleButtonRef}></div>
          {/* Test Button */}
          <Button
            onClick={handleManualTest}
            className="w-full h-12 text-base"
            variant="secondary"
          >
            Test Sign In (Demo)
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to Pinterest's Terms of Service and Privacy
            Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
