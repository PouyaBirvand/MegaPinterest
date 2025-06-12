import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AltTextField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="altText" className="text-base font-semibold">
        Alt text
      </Label>
      <Input
        id="altText"
        placeholder="Explain what people can see in the Pin"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Alt text describes your Pin for people using screen readers
      </p>
    </div>
  );
}
