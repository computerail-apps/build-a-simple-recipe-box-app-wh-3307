import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Button } from '@/lib/ui/Button';
import { RefreshCw, ChefHat } from 'lucide-react';
import { fetchRecipe, updateRecipe, type RecipeInput } from '@/lib/recipes';
import { RecipeForm } from '@/components/RecipeForm';

export default function RecipeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id as string),
    enabled: Boolean(id),
  });

  async function handleSubmit(input: RecipeInput) {
    const updated = await updateRecipe(id as string, input);
    qc.invalidateQueries({ queryKey: ['recipes'] });
    qc.invalidateQueries({ queryKey: ['recipe', id] });
    navigate(`/recipes/${updated.id}`);
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-h1">Edit Recipe</h1>
          <p className="text-body text-muted-foreground">Update the details and save your changes.</p>
        </div>

        {isLoading ? (
          <CenteredSpinner label="Loading recipe" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load recipe</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw size={16} />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : !data ? (
          <EmptyState icon={<ChefHat size={40} />} title="Recipe not found" description="It may have been deleted." />
        ) : (
          <RecipeForm
            submitLabel="Save Changes"
            initial={{ title: data.title, ingredients: data.ingredients, steps: data.steps, tags: data.tags }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </Container>
  );
}
