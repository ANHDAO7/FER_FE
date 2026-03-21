'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Clock, Sparkles, ChefHat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Recipe {
  id: string;
  title: string;
  cooking_time: string;
  dietary_label: string;
  image_url: string;
}

const DIET_COLORS: Record<string, string> = {
  Vegan: 'bg-emerald-500 hover:bg-emerald-600',
  Vegetarian: 'bg-green-500 hover:bg-green-600',
  Keto: 'bg-purple-500 hover:bg-purple-600',
  Dessert: 'bg-pink-500 hover:bg-pink-600',
  'Quick Meal': 'bg-blue-500 hover:bg-blue-600',
  Paleo: 'bg-orange-500 hover:bg-orange-600',
};

function getDietClass(label: string) {
  return DIET_COLORS[label] || 'bg-[#D4AF37] hover:bg-[#b5952f]';
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl py-20 md:py-28 text-center relative">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#8B6914] text-xs font-semibold rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            Community Recipe Platform
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-[#1A1A1A] leading-tight tracking-tight mb-6 animate-fade-up-delay-1">
            Discover &amp; Share
            <br />
            <span className="gradient-gold">Amazing Recipes</span>
          </h1>

          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up-delay-2">
            Explore a curated collection of culinary masterpieces. Upload your own
            creations and inspire the community.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up-delay-3">
            <Link href="/login">
              <button className="btn-gold px-8 py-3 rounded-2xl text-white font-semibold text-sm shadow-lg">
                Start Cooking 🍳
              </button>
            </Link>
            <a href="#recipes">
              <button className="px-8 py-3 rounded-2xl text-sm font-semibold border-2 border-[#D4AF37]/40 text-[#8B6914] hover:bg-[#D4AF37]/5 transition-all">
                Browse Recipes ↓
              </button>
            </a>
          </div>

          {/* Floating stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-14 animate-fade-up-delay-3">
            {[
              { icon: '🍽️', label: `${loading ? '...' : recipes.length} Recipes` },
              { icon: '👨‍🍳', label: 'Community Chefs' },
              { icon: '⭐', label: 'Curated Quality' },
            ].map((s) => (
              <div key={s.label} className="glass-card px-5 py-3 rounded-2xl flex items-center gap-2.5 animate-float">
                <span className="text-xl">{s.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recipe Grid using Shadcn UI Card & Badge ─── */}
      <section id="recipes" className="container mx-auto px-6 max-w-7xl py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1A1A1A] mb-2">
            Latest Recipes
          </h2>
          <div className="section-divider" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="skeleton h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-2/3" />
                  <div className="skeleton h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full btn-gold flex items-center justify-center shadow-lg animate-float">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No recipes yet!</p>
            <p className="text-sm text-gray-400">Be the first to share a delicious recipe.</p>
            <Link href="/login">
              <button className="btn-gold px-6 py-2.5 rounded-xl text-white text-sm font-semibold mt-2">
                Add Your Recipe →
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              /* ── Shadcn UI <Card> ── */
              <Card
                key={recipe.id}
                className="recipe-card border-none shadow-sm animate-fade-up overflow-hidden"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Food thumbnail */}
                <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                  <Image
                    src={recipe.image_url || 'https://placehold.co/600x400/F5F3EE/D4AF37?text=No+Image'}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  {/* ── Shadcn UI <Badge> for dietary label ── */}
                  {recipe.dietary_label && (
                    <Badge
                      className={`absolute top-3 right-3 text-white border-none text-xs font-semibold ${getDietClass(recipe.dietary_label)}`}
                    >
                      {recipe.dietary_label}
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="font-serif text-lg text-[#1A1A1A] truncate">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* ── Shadcn UI <Badge> for cooking time ── */}
                  <Badge
                    variant="secondary"
                    className="bg-[#D4AF37]/10 text-[#8B6914] border border-[#D4AF37]/25 hover:bg-[#D4AF37]/20 gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    {recipe.cooking_time}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
