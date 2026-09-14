import { useState, type FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Plus, Trash2, X } from 'lucide-react';
import type { RecipeInput } from '@/lib/recipes';

interface RecipeFormProps {
  initial?: RecipeInput;
  submitLabel: string;
  onSubmit: (input: RecipeInput) => Promise<void>;
}

export function RecipeForm({ initial, submitLabel, onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [ingredients, setIngredients] = useState<string[]>(
    initial?.ingredients && initial.ingredients.length > 0 ? initial.ingredients : ['']
  );
  const [steps, setSteps] = useState<string[]>(
    initial?.steps && initial.steps.length > 0 ? initial.steps : ['']
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) => prev.map((v, i) => (i === index ? value : v)));
  }
  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((v, i) => (i === index ? value : v)));
  }
  function removeIngredient(index: number) {
    setIngredients((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }
  function removeStep(index: number) {
    setSteps((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }
  function commitTagDraft() {
    const parts = tagDraft
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));
    if (parts.length > 0) setTags((prev) => [...prev, ...parts]);
    setTagDraft('');
  }
  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanIngredients = ingredients.map((i) => i.trim()).filter((i) => i.length > 0);
    const cleanSteps = steps.map((s) => s.trim()).filter((s) => s.length > 0);
    if (!title.trim()) {
      setError('Please give your recipe a title.');
      return;
    }
    if (cleanIngredients.length === 0) {
      setError('Add at least one ingredient.');
      return;
    }
    if (cleanSteps.length === 0) {
      setError('Add at least one step.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), ingredients: cleanIngredients, steps: cleanSteps, tags });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Couldn't save recipe</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recipe details</CardTitle>
          <CardDescription>Give your recipe a name and a few tags to find it later.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Recipe title, e.g. Weeknight Chili"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add tags, comma separated (e.g. dinner, spicy)"
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    commitTagDraft();
                  }
                }}
                onBlur={commitTagDraft}
                disabled={submitting}
              />
              <Button type="button" variant="outline" onClick={commitTagDraft} disabled={submitting}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="inline-flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full transition-colors duration-150 hover:text-destructive"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>One ingredient per line, in the order you'd shop for them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-small tabular-nums text-muted-foreground">{index + 1}.</span>
              <Input
                placeholder="e.g. 2 cups flour"
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                disabled={submitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={submitting || ingredients.length === 1}
                aria-label="Remove ingredient"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setIngredients((prev) => [...prev, ''])} disabled={submitting}>
            <Plus size={16} />
            Add ingredient
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Steps</CardTitle>
          <CardDescription>Break the method into clear, numbered steps.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-small tabular-nums text-muted-foreground">{index + 1}.</span>
              <Input
                placeholder="e.g. Preheat oven to 400°F"
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                disabled={submitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStep(index)}
                disabled={submitting || steps.length === 1}
                aria-label="Remove step"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setSteps((prev) => [...prev, ''])} disabled={submitting}>
            <Plus size={16} />
            Add step
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
