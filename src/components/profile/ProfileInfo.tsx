import { User } from '@/types/profile.types';
import { Mail } from 'lucide-react';

export default function ProfileInfo({ user }: { user: User }) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2">
        {user?.name || 'Anonymous User'}
      </h1>
      {user?.email && (
        <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
      )}
    </>
  );
}
