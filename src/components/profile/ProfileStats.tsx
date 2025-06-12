import { UserStats } from '@/types/profile.types';
import StatItem from './StatItem';

export default function ProfileStats({ userStats }: { userStats: UserStats }) {
  return (
    <div className="flex justify-center space-x-8 mb-6">
      <StatItem label="Boards" value={userStats.boards} />
      <StatItem label="Pins" value={userStats.pins} />
      <StatItem label="Followers" value={userStats.followers} />
      <StatItem label="Following" value={userStats.following} />
    </div>
  );
}
