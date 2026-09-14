import { supabase } from './supabase';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface RecipeInput {
  title: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
}

const COLUMNS = 'id,title,ingredients,steps,tags,created_at,updated_at';

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(COLUMNS)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Recipe[];
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .select(COLUMNS)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Recipe;
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({
      title: input.title,
      ingredients: input.ingredients,
      steps: input.steps,
      tags: input.tags,
    })
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data as Recipe;
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .update({
      title: input.title,
      ingredients: input.ingredients,
      steps: input.steps,
      tags: input.tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(COLUMNS)
    .single();
  if (error) throw error;
  return data as Recipe;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) throw error;
}
