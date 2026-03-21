'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, ChefHat, Search, X, Heart, Calendar, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Recipe {
  id: string;
  title: string;
  cooking_time: string;
  dietary_label: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string;
}

const DIET_COLORS: Record<string, string> = {
  Vegan:         'bg-green-500',
  Vegetarian:    'bg-emerald-500',
  Keto:          'bg-purple-500',
  Dessert:       'bg-pink-500',
  'Quick Meal':  'bg-blue-500',
  Paleo:         'bg-orange-500',
  Breakfast:     'bg-yellow-500',
  Dinner:        'bg-red-500',
  Soup:          'bg-cyan-600',
};

function tagColor(label: string | null) {
  if (!label) return 'bg-[#D4AF37]';
  return DIET_COLORS[label] ?? 'bg-[#D4AF37]';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ─── Recipe Detail Modal ─── */
function RecipeDetailModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSaved(savedList.includes(recipe.id));
  }, [recipe.id]);

  const toggleSave = () => {
    const savedList: string[] = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    if (saved) {
      localStorage.setItem('savedRecipes', JSON.stringify(savedList.filter((id) => id !== recipe.id)));
    } else {
      localStorage.setItem('savedRecipes', JSON.stringify([...savedList, recipe.id]));
    }
    setSaved(!saved);
  };

  const description = `A delicious ${recipe.title} that brings together fresh ingredients and bold flavors.${
    recipe.dietary_label ? ` Perfect for ${recipe.dietary_label.toLowerCase()} lovers, this recipe` : ' This recipe'
  } takes just ${recipe.cooking_time} to prepare and is sure to impress your family and friends.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left — Image */}
          <div className="relative w-full md:w-2/5 h-64 md:h-auto shrink-0 bg-gray-100">
            <Image
              src={recipe.image_url || 'https://placehold.co/600x800/F5F3EE/D4AF37?text=🍽️'}
              alt={recipe.title}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {recipe.dietary_label && (
              <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full ${tagColor(recipe.dietary_label)}`}>
                {recipe.dietary_label.toUpperCase()}
              </span>
            )}
            <button
              onClick={toggleSave}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
                saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Right — Details */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <h2 className="font-bold font-serif text-2xl text-gray-900 pr-10 mb-4 leading-snug">
              {recipe.title}
            </h2>

            {/* Pill badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                {recipe.cooking_time}
              </span>
              {recipe.dietary_label && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  {recipe.dietary_label}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <Calendar className="w-3.5 h-3.5" />
                Added {formatDate(recipe.created_at)}
              </span>
            </div>

            <hr className="mb-5 border-gray-100" />

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Cooking Time
                </p>
                <p className="font-bold text-gray-800 text-sm">{recipe.cooking_time}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  🏷️ Category
                </p>
                <p className="font-bold text-gray-800 text-sm">{recipe.dietary_label || 'General'}</p>
              </div>
            </div>

            {/* Description */}
            <h3 className="font-bold text-gray-900 mb-2">About this Recipe</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {description.split(recipe.title).map((part, i, arr) =>
                i < arr.length - 1
                  ? [part, <strong key={i} className="text-gray-900">{recipe.title}</strong>]
                  : part
              )}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={toggleSave}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  saved
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 text-gray-700 hover:border-[#D4AF37]/50 hover:text-[#8B6914]'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current text-red-500' : ''}`} />
                {saved ? 'Saved!' : 'Save Recipe'}
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                🔗 Share
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedIds(saved);
  }, []);

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          (r.dietary_label?.toLowerCase() ?? '').includes(search.toLowerCase())
      ),
    [recipes, search]
  );

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('savedRecipes', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div>
      {/* ─── Hero / Search bar section ─── */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl py-14 md:py-20 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#1A1A1A] leading-tight mb-4 animate-fade-up">
            Discover &amp; Share
            <br />
            <span className="gradient-gold">Amazing Recipes</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8 animate-fade-up-delay-1 text-sm md:text-base">
            Explore a curated collection of culinary masterpieces from our community.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto animate-fade-up-delay-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-white/90 shadow-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 text-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Recipes Section ─── */}
      <section id="recipes" className="container mx-auto px-6 max-w-7xl py-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            {search ? `Results for "${search}"` : 'All Recipes'}
          </h2>
          {!loading && (
            <span className="text-sm text-gray-400 font-medium">{filtered.length} recipe{filtered.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Status bar */}
        {!loading && recipes.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-6">
            <span className="text-[#D4AF37]">↗</span>
            <span className="font-semibold text-gray-700">{filtered.length} recipes available</span>
            <span>·</span>
            <span>Updated just now</span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="skeleton h-44 w-full" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full btn-gold flex items-center justify-center shadow-lg animate-float">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold text-gray-700">
              {search ? `No recipes found for "${search}"` : 'No recipes yet!'}
            </p>
            {!search && (
              <Link href="/login">
                <button className="btn-gold px-5 py-2 rounded-xl text-white text-sm font-semibold">
                  Add Your Recipe →
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((recipe, i) => {
              const isSaved = savedIds.includes(recipe.id);
              return (
                <Card
                  key={recipe.id}
                  onClick={() => setSelected(recipe)}
                  className="recipe-card border-0 shadow-sm cursor-pointer group animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="relative w-full h-44 overflow-hidden bg-gray-100">
                    <Image
                      src={recipe.image_url || 'https://placehold.co/400x300/F5F3EE/D4AF37?text=🍽️'}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* Category badge — top left */}
                    {recipe.dietary_label && (
                      <Badge
                        className={`absolute top-2 left-2 text-white border-none text-[10px] font-bold px-2 py-0.5 ${tagColor(recipe.dietary_label)}`}
                      >
                        {recipe.dietary_label.toUpperCase()}
                      </Badge>
                    )}

                    {/* Heart — top right */}
                    <button
                      onClick={(e) => toggleSave(e, recipe.id)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
                        isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-bold text-[#1A1A1A] text-sm truncate mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {/* Shadcn Badge for time */}
                      <Badge
                        variant="secondary"
                        className="text-[10px] gap-1 bg-[#D4AF37]/10 text-[#8B6914] border-[#D4AF37]/20 hover:bg-[#D4AF37]/15"
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {recipe.cooking_time}
                      </Badge>

                      {/* Shadcn Badge for dietary */}
                      {recipe.dietary_label && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        >
                          {recipe.dietary_label}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── Recipe Detail Modal ─── */}
      {selected && (
        <RecipeDetailModal recipe={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
