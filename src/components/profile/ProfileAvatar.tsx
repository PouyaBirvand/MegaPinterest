import { User } from '@/types/profile.types';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export default function ProfileAvatar({ user }: { user: User }) {
  return (
    <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-background shadow-lg">
      <AvatarImage
        src={user?.image || '/profile.png'}
        alt={user?.name || 'Profile'}
      />
      <AvatarFallback className="text-4xl">
        {user?.name?.[0] || 'U'}
      </AvatarFallback>
    </Avatar>
  );
}
