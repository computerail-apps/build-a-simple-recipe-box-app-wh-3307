import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { ListChecks } from 'lucide-react';
import type { Recipe } from '@/lib/recipes';

export function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-all duration-150 ease-out hover:shadow-elev-2 hover:-translate-y-0.5"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <CardHeader>
        <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {recipe.tags.length === 0 ? (
            <span className="text-small text-muted-foreground">No tags</span>
          ) : (
            recipe.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)
          )}
        </div>
      </CardContent>
      <CardFooter>
        <span className="inline-flex items-center gap-1.5 text-small text-muted-foreground">
          <ListChecks size={14} />
          {recipe.ingredients.length} ingredient{recipe.ingredients.length === 1 ? '' : 's'}
        </span>
      </CardFooter>
    </Card>
  );
}
