import { Button } from '@/lib/ui/Button';
import { Tag } from 'lucide-react';

interface TagFilterBarProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

export function TagFilterBar({ tags, selected, onToggle, onClear }: TagFilterBarProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-small text-muted-foreground">
        <Tag size={14} />
        Filter:
      </span>
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <Button
            key={tag}
            size="sm"
            variant={active ? 'secondary' : 'outline'}
            onClick={() => onToggle(tag)}
          >
            {tag}
          </Button>
        );
      })}
      {selected.length > 0 && (
        <Button size="sm" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
