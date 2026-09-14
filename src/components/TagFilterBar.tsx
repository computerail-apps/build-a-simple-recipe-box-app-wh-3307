import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';

interface Props {
  tags: string[];
  active: string | null;
  onSelect: (tag: string | null) => void;
}

export function TagFilterBar({ tags, active, onSelect }: Props) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={cn(
          'transition-colors duration-150 ease-out',
          active === null ? '' : 'opacity-70 hover:opacity-100'
        )}
      >
        <Badge variant={active === null ? 'default' : 'outline'}>All</Badge>
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelect(tag)}
          className={cn(
            'transition-colors duration-150 ease-out',
            active === tag ? '' : 'opacity-70 hover:opacity-100'
          )}
        >
          <Badge variant={active === tag ? 'default' : 'outline'}>{tag}</Badge>
        </button>
      ))}
    </div>
  );
}
