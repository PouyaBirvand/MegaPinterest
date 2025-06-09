'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    google: any;
  }
}

export function useGoogleAuth() {
  const { signIn } = useAuth();
  const router = useRouter();

  const initializeGoogleAuth = () => {
    const clientId =
      '794859400910-c57np2s6sl21j8hpo17ojiir6e1kislo.apps.googleusercontent.com';

    console.log('Client ID:', clientId); // برای دیباگ

    if (!clientId) {
      console.error('Google Client ID is not defined');
      return;
    }

    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log('Google response:', response);

      // دیکد کردن JWT token از Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Decoded payload:', payload);

      const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        image: payload.picture,
      };

      signIn(userData);
      router.push('/');
    } catch (error) {
      console.error('Error handling Google sign in:', error);
    }
  };

  const signInWithGoogle = () => {
    const clientId =
      '794859400910-c57np2s6sl21j8hpo17ojiir6e1kislo.apps.googleusercontent.com';

    if (!clientId) {
      console.error('Google Client ID is not defined');
      return;
    }

    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const renderGoogleButton = (elementId: string) => {
    const clientId =
      '794859400910-c57np2s6sl21j8hpo17ojiir6e1kislo.apps.googleusercontent.com';

    if (!clientId) {
      console.error('Google Client ID is not defined');
      return;
    }

    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
        }
      );
    }
  };

  return {
    initializeGoogleAuth,
    signInWithGoogle,
    renderGoogleButton,
  };
}
