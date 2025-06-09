'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pin } from '@/types';
import { EyeOff, Info } from 'lucide-react';
import Image from 'next/image';

interface HidePinDialogProps {
    pin: Pin;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onHide: (reason: string, feedback?: string) => void;
}

const HIDE_REASONS = [
    { value: 'not_interested', label: 'Not interested in this content' },
    { value: 'seen_before', label: 'I\'ve seen this before' },
    { value: 'irrelevant', label: 'Not relevant to me' },
    { value: 'poor_quality', label: 'Poor image quality' },
    { value: 'duplicate', label: 'Duplicate content' },
    { value: 'outdated', label: 'Outdated information' },
    { value: 'wrong_category', label: 'Wrong category for my interests' },
    { value: 'other', label: 'Other reason' },
];

export default function HidePinDialog({
    pin,
    open,
    onOpenChange,
    onHide,
}: HidePinDialogProps) {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        try {
            await onHide(selectedReason, feedback.trim() || undefined);
            onOpenChange(false);
            // Reset form
            setSelectedReason('');
            setFeedback('');
        } catch (error) {
            console.error('Hide submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedReason('');
        setFeedback('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        Hide Pin
                    </DialogTitle>
                    <DialogDescription>
                        Help us understand why you want to hide this pin. We'll use this to improve your recommendations.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Pin Preview */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Image
                            width={50}
                            height={50}
                            src={pin.imageUrl}
                            alt={pin.title || 'Pin'}
                            className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {pin.title || 'Untitled Pin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                by {pin.author.name}
                            </p>
                        </div>
                    </div>

                    {/* Reason Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Why do you want to hide this pin? *</Label>
                        <Select value={selectedReason} onValueChange={setSelectedReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {HIDE_REASONS.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Additional Feedback */}
                    <div className="space-y-2">
                        <Label htmlFor="feedback">
                            Additional feedback (optional)
                        </Label>
                        <Textarea
                            id="feedback"
                            placeholder="Tell us more about why you're hiding this pin to help us improve your feed..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={3}
                            maxLength={300}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {feedback.length}/300 characters
                        </p>
                    </div>

                    {/* Info Notice */}
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800 dark:text-blue-200">
                            <p className="font-medium">What happens when you hide a pin:</p>
                            <ul className="mt-1 space-y-1 list-disc list-inside">
                                <li>This pin won't appear in your feed anymore</li>
                                <li>We'll show you fewer similar pins</li>
                                <li>You can still find it if you search for it directly</li>
                                <li>You can unhide it from your hidden pins list</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedReason || isSubmitting}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Hiding...
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide Pin
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}