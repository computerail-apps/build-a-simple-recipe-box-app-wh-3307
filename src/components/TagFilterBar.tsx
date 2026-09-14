import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';

export function TagFilterBar({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'transition-colors duration-150 ease-out',
        )}
      >
        <Badge variant={activeTag === null ? 'default' : 'outline'}>All</Badge>
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className="transition-colors duration-150 ease-out"
        >
          <Badge variant={activeTag === tag ? 'default' : 'outline'}>{tag}</Badge>
        </button>
      ))}
    </div>
  );
}
