import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LinkField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="link" className="text-base font-semibold">
        Link
      </Label>
      <Input
        id="link"
        placeholder="Add a destination link"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2"
      />
    </div>
  );
}
