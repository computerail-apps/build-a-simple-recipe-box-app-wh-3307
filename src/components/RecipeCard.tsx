import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { ChefHat, ListChecks } from 'lucide-react';
import type { Recipe } from '@/lib/recipes';

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: Props) {
  return (
    <Card
      className="flex h-full cursor-pointer flex-col transition-all duration-150 ease-out hover:shadow-elev-3 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-start gap-2">
          <ChefHat size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
          <span className="line-clamp-2">{recipe.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {recipe.tags && recipe.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-small text-muted-foreground">No tags</span>
        )}
      </CardContent>
      <CardFooter>
        <span className="inline-flex items-center gap-1.5 text-small text-muted-foreground">
          <ListChecks size={14} />
          {recipe.ingredients?.length ?? 0} ingredient{recipe.ingredients?.length === 1 ? '' : 's'}
        </span>
      </CardFooter>
    </Card>
  );
}
