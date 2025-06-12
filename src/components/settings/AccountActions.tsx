import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useSignOut } from '@/hooks/useSignOut';

export const AccountActions: React.FC = () => {
  const { isSigningOut, handleSignOut } = useSignOut();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Account Actions</h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
        <Button variant="destructive" disabled>
          Delete Account
        </Button>
      </div>
    </div>
  );
};
