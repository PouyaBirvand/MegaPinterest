'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import { usePinsActions } from '@/hooks/usePinsActions';
import { HiddenPinDetail } from '@/types';

export default function HiddenPinsManager() {
  const [hiddenDetails, setHiddenDetails] = useState<HiddenPinDetail[]>([]);
  const { unhidePin, getPinById } = usePinsActions();

  useEffect(() => {
    const details = JSON.parse(
      localStorage.getItem('hiddenPinDetails') || '[]'
    );
    setHiddenDetails(details);
  }, []);

  const handleUnhide = (pinId: string) => {
    try {
      unhidePin(pinId);
      setHiddenDetails(prev => prev.filter(detail => detail.pinId !== pinId));
    } catch (error) {
      console.error('Failed to unhide pin:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hidden Pins</h2>

      {hiddenDetails.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No hidden pins</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {hiddenDetails.map(detail => {
            const pin = getPinById(detail.pinId);
            return (
              <Card key={detail.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{pin?.title || 'Unknown Pin'}</span>
                    <Button
                      onClick={() => handleUnhide(detail.pinId)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Unhide
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Reason:</strong>{' '}
                      {detail.reason || 'Not specified'}
                    </p>
                    {detail.feedback && (
                      <p>
                        <strong>Feedback:</strong> {detail.feedback}
                      </p>
                    )}
                    <p>
                      <strong>Hidden at:</strong>{' '}
                      {new Date(detail.hiddenAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
