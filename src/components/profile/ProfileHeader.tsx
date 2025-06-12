import type { User, UserStats } from '@/types/profile.types';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';

interface ProfileHeaderProps {
  user: User;
  userStats: UserStats;
}

export default function ProfileHeader({ user, userStats }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <ProfileAvatar user={user} />
          <ProfileInfo user={user} />
          <ProfileStats userStats={userStats} />
          <ProfileActions />
        </div>
      </div>
    </div>
  );
}
