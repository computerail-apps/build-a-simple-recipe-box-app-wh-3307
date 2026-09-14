import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { ChefHat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '@/lib/recipes';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();
  return (
    <Card className="flex h-full flex-col transition-all duration-150 ease-out hover:shadow-elev-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat size={18} className="text-muted-foreground" />
          {recipe.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-2">
          {recipe.tags.length === 0 ? (
            <span className="text-small text-muted-foreground">No tags</span>
          ) : (
            recipe.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))
          )}
        </div>
        <p className="text-small text-muted-foreground">
          {recipe.ingredients.length} ingredient{recipe.ingredients.length === 1 ? '' : 's'} ·{' '}
          {recipe.steps.length} step{recipe.steps.length === 1 ? '' : 's'}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/recipes/${recipe.id}`)}>
          View recipe
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
