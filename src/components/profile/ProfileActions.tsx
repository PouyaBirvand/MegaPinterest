import Link from 'next/link';
import { Button } from '../ui/button';
import { Settings, Share } from 'lucide-react';

export default function ProfileActions() {
  return (
    <div className="flex justify-center space-x-4">
      <Button asChild>
        <Link href="/settings">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Link>
      </Button>
      <Button variant="outline">
        <Share className="h-4 w-4 mr-2" />
        Share Profile
      </Button>
    </div>
  );
}
