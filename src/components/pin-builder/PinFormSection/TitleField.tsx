import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TitleField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="title" className="text-base font-semibold">
        Title *
      </Label>
      <Input
        id="title"
        placeholder="Add your title"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2"
      />
    </div>
  );
}
