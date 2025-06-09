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
import { Flag, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface ReportPinDialogProps {
    pin: Pin;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onReport: (reason: string, description?: string) => void;
}

const REPORT_REASONS = [
    { value: 'spam', label: 'Spam or misleading content' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'violence', label: 'Violence or dangerous content' },
    { value: 'hate', label: 'Hate speech' },
    { value: 'misinformation', label: 'False information' },
    { value: 'other', label: 'Other' },
];

export default function ReportPinDialog({
    pin,
    open,
    onOpenChange,
    onReport,
}: ReportPinDialogProps) {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        try {
            await onReport(selectedReason, description.trim() || undefined);
            onOpenChange(false);
            // Reset form
            setSelectedReason('');
            setDescription('');
        } catch (error) {
            console.error('Report submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedReason('');
        setDescription('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Flag className="h-5 w-5 text-red-500" />
                        Report Pin
                    </DialogTitle>
                    <DialogDescription>
                        Help us understand what's wrong with this pin. Your report will be reviewed by our team.
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
                        <Label htmlFor="reason">Reason for reporting *</Label>
                        <Select value={selectedReason} onValueChange={setSelectedReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_REASONS.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                        {reason.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Additional Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Additional details (optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Provide more context about why you're reporting this pin..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {description.length}/500 characters
                        </p>
                    </div>

                    {/* Warning Notice */}
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-800 dark:text-amber-200">
                            <p className="font-medium">Please note:</p>
                            <p>False reports may result in restrictions on your account. Only report content that violates our community guidelines.</p>
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
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Flag className="h-4 w-4 mr-2" />
                                Submit Report
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}