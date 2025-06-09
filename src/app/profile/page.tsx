'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MasonryGrid } from '@/components/pins/MasonryGrid';
import { useBoards } from '@/contexts/BoardsContext';
import { usePins } from '@/contexts/PinsContext';
import { Settings, Share, Mail, Pin, NotebookPen } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuth(); 
  const router = useRouter();
  const { state: boardsState } = useBoards();
  const { state: pinsState } = usePins();
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]); 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // تغییر این خط
    return null;
  }

  const userStats = {
    boards: boardsState.boards.length,
    pins: pinsState.savedPins.length,
    followers: Math.floor(Math.random() * 1000), // Mock data
    following: Math.floor(Math.random() * 500), // Mock data
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            {/* Avatar */}
            <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-background shadow-lg">
              <AvatarImage
                src={user?.image || '/profile.png'}
                alt={user?.name || 'Profile'}
              />
              <AvatarFallback className="text-4xl">
                {user?.name || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <h1 className="text-4xl font-bold mb-2">
              {user?.name || 'Anonymous User'}
            </h1>

            {user?.name && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-4">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.boards}</div>
                <div className="text-sm text-muted-foreground">Boards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.pins}</div>
                <div className="text-sm text-muted-foreground">Pins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{userStats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>

            {/* Actions */}
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
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            {/* <TabsTrigger value="boards">Boards</TabsTrigger> */}
          </TabsList>

          <TabsContent value="created" className="mt-8">
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <NotebookPen />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Nothing to show...yet!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Pins you create will live here.
                </p>
                <Button asChild>
                  <Link href="/pin-builder">Create your first Pin</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-8">
            {pinsState.savedPins.length > 0 ? (
              <MasonryGrid pins={pinsState.savedPins} />
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Pin />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No saved Pins yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Pins you save will appear here.
                  </p>
                  <Button asChild>
                    <Link href="/explore">Explore ideas</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          {/* 
          <TabsContent value="boards" className="mt-8">
            {boardsState.boards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {boardsState.boards.map(board => (
                  <Card
                    key={board.id}
                    className="group hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="p-0">
                      <Link href={`/boards/${board.id}`}>
                        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                          {board.pins.length > 0 ? (
                            <div className="grid grid-cols-2 gap-1 h-full">
                              {board.pins.slice(0, 4).map((pin, index) => (
                                <Image
                                  key={pin.id}
                                  src={pin.imageUrl}
                                  alt={pin.title}
                                  className="w-full h-full object-cover"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-4xl text-muted-foreground">
                                📋
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-1">
                        {board.title}
                      </CardTitle>
                      <CardDescription>
                        {board.pins.length} pins
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Create your first board
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Boards help you organize your Pins.
                  </p>
                  <Button asChild>
                    <Link href="/boards">Create board</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
