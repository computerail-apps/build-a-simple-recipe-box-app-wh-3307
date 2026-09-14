import { useNavigate } from 'react-router-dom';
import { Container } from '@/lib/ui/Container';
import { RecipeForm } from '@/components/RecipeForm';
import { createRecipe, type RecipeInput } from '@/lib/recipes';

export default function RecipeNew() {
  const navigate = useNavigate();

  async function handleSubmit(input: RecipeInput) {
    const recipe = await createRecipe(input);
    navigate(`/recipes/${recipe.id}`);
  }

  return (
    <Container>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-1">
          <h1 className="text-h1">New Recipe</h1>
          <p className="text-body text-muted-foreground">
            Capture the title, ingredients, steps, and tags for your recipe.
          </p>
        </div>
        <RecipeForm submitLabel="Save Recipe" onSubmit={handleSubmit} />
      </div>
    </Container>
  );
}
