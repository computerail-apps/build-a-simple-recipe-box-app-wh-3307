import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { Button } from '@/lib/ui/Button';
import { BookOpen, Plus } from 'lucide-react';
import RecipeList from '@/pages/RecipeList';
import RecipeNew from '@/pages/RecipeNew';
import RecipeDetail from '@/pages/RecipeDetail';
import RecipeEdit from '@/pages/RecipeEdit';

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Nav
        brand={
          <span className="inline-flex items-center gap-2">
            <BookOpen size={18} />
            Recipe Box
          </span>
        }
        actions={
          <Button size="sm" onClick={() => navigate('/recipes/new')}>
            <Plus size={16} />
            New Recipe
          </Button>
        }
      >
        <NavLink href="#" active={location.pathname === '/'} onClick={() => navigate('/')}>
          All Recipes
        </NavLink>
      </Nav>
      <main className="py-8">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipes/new" element={<RecipeNew />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<RecipeEdit />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
