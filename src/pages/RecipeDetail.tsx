import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { ArrowLeft, Pencil, Trash2, ChefHat, RefreshCw } from 'lucide-react';
import { deleteRecipe, fetchRecipe } from '@/lib/recipes';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipe(id as string),
    enabled: Boolean(id),
  });

  const remove = useMutation({
    mutationFn: () => deleteRecipe(id as string),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipes'] });
      navigate('/');
    },
  });

  return (
    <Container>
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to recipes
        </Button>

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
          <Card>
            <CardHeader className="space-y-3">
              <CardTitle className="flex items-center gap-2 text-h2">
                <ChefHat size={22} className="text-muted-foreground" />
                {data.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {data.tags.length === 0 ? (
                  <span className="text-small text-muted-foreground">No tags</span>
                ) : (
                  data.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="mb-3 text-h3">Ingredients</h2>
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {data.ingredients.map((ingredient, index) => (
                    <li key={index} className="px-4 py-2 text-body">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-3 text-h3">Steps</h2>
                <ol className="space-y-3">
                  {data.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-micro tabular-nums text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="text-body">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={() => navigate(`/recipes/${data.id}/edit`)}>
                <Pencil size={16} />
                Edit
              </Button>
              {confirmingDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-small text-muted-foreground">Delete this recipe?</span>
                  <Button variant="destructive" size="sm" onClick={() => remove.mutate()} disabled={remove.isPending}>
                    {remove.isPending ? 'Deleting…' : 'Confirm'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)} disabled={remove.isPending}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" onClick={() => setConfirmingDelete(true)}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
            </CardFooter>
            {remove.isError && (
              <div className="px-6 pb-6">
                <Alert variant="destructive">
                  <AlertTitle>Couldn't delete recipe</AlertTitle>
                  <AlertDescription>{(remove.error as Error).message}</AlertDescription>
                </Alert>
              </div>
            )}
          </Card>
        )}
      </div>
    </Container>
  );
}
