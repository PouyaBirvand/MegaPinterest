import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const privacyOptions = [
  {
    title: 'Private Profile',
    description: 'Only you can see your boards and pins',
    defaultChecked: false,
  },
  {
    title: 'Search Engine Indexing',
    description: 'Let search engines index your public boards',
    defaultChecked: true,
  },
];

export const PrivacyTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Privacy & Security</CardTitle>
      <CardDescription>
        Control your privacy and security settings
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {privacyOptions.map((option, index) => (
          <React.Fragment key={option.title}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{option.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <Switch defaultChecked={option.defaultChecked} disabled />
            </div>
            {index < privacyOptions.length - 1 && <Separator />}
          </React.Fragment>
        ))}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Data Download</Label>
            <p className="text-sm text-muted-foreground">
              Download a copy of your Pinterest data
            </p>
          </div>
          <Button variant="outline" disabled>
            Request Data
          </Button>
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-base font-medium text-destructive">Danger Zone</h3>
        <div className="border border-destructive/20 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Delete Account</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" disabled>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
