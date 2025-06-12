interface PinBuilderHeaderProps {
  title?: string;
  description?: string;
}

export function PinBuilderHeader({
  title = 'Create Pin',
  description = 'Share your ideas with the world',
}: PinBuilderHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
