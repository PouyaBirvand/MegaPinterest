import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DescriptionField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="description" className="text-base font-semibold">
        Description
      </Label>
      <Textarea
        id="description"
        placeholder="Tell everyone what your Pin is about"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2 min-h-[100px]"
      />
    </div>
  );
}
