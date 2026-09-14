import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/lib/ui/Container';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { BookOpen, Plus, Search, RefreshCw } from 'lucide-react';
import { fetchRecipes } from '@/lib/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { TagFilterBar } from '@/components/TagFilterBar';

export default function RecipeList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  const allTags = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((r) => r.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((r) => {
      const matchesSearch = search.trim().length === 0 || r.title.toLowerCase().includes(search.trim().toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every((t) => r.tags.includes(t));
      return matchesSearch && matchesTags;
    });
  }, [data, search, selectedTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-display">Recipe Box</h1>
            <p className="text-body text-muted-foreground">
              Your personal collection of recipes, tagged and ready to cook.
            </p>
          </div>
          <Button onClick={() => navigate('/recipes/new')}>
            <Plus size={16} />
            New Recipe
          </Button>
        </div>

        {isLoading ? (
          <CenteredSpinner label="Loading your recipes" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load recipes</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw size={16} />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={40} />}
            title="Your recipe box is empty"
            description="Save your first recipe with ingredients, steps, and tags to start building your collection."
            action={
              <Button onClick={() => navigate('/recipes/new')}>
                <Plus size={16} />
                Add your first recipe
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search recipes by title…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <TagFilterBar tags={allTags} selected={selectedTags} onToggle={toggleTag} onClear={() => setSelectedTags([])} />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<Search size={40} />}
                title="No recipes match"
                description="Try a different search term or clear your tag filters."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
