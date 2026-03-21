'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Edit, Clock, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Recipe {
  id: string;
  title: string;
  cooking_time: string;
  dietary_label: string;
  image_url: string;
}

const DIET_COLORS: Record<string, string> = {
  Vegan: 'bg-emerald-500',
  Vegetarian: 'bg-green-500',
  Keto: 'bg-purple-500',
  Dessert: 'bg-pink-500',
  'Quick Meal': 'bg-blue-500',
  Paleo: 'bg-orange-500',
  Default: 'bg-[#D4AF37]',
};

function getDietColor(label: string) {
  return DIET_COLORS[label] || DIET_COLORS['Default'];
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cookingTime: '',
    dietaryLabel: '',
    file: null as File | null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    else if (user) fetchRecipes();
  }, [user, loading, router]);

  const fetchRecipes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setRecipes(data);
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    if (!user) return '';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.file) imageUrl = await handleUploadImage(formData.file);

      const payload: Record<string, string> = {
        title: formData.title,
        cooking_time: formData.cookingTime,
        dietary_label: formData.dietaryLabel,
      };
      if (imageUrl) payload.image_url = imageUrl;

      let error;
      if (editingId) {
        ({ error } = await supabase.from('recipes').update(payload).eq('id', editingId));
      } else {
        ({ error } = await supabase.from('recipes').insert([
          { ...payload, user_id: user.id, image_url: imageUrl || '' },
        ]));
      }

      if (!error) {
        setIsOpen(false);
        fetchRecipes();
        resetForm();
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('recipes').delete().eq('id', deleteId);
    setIsDeleteOpen(false);
    setDeleteId(null);
    fetchRecipes();
  };

  const openEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setFormData({ title: recipe.title, cookingTime: recipe.cooking_time, dietaryLabel: recipe.dietary_label || '', file: null });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', cookingTime: '', dietaryLabel: '', file: null });
    setEditingId(null);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FAFAF7]">
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white py-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-1">
                My Kitchen
              </p>
              <h1 className="text-3xl font-bold font-serif">My Recipes</h1>
              <p className="text-gray-400 text-sm mt-1">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>

            {/* Add Dialog */}
            <Dialog
              open={isOpen}
              onOpenChange={(open: boolean) => {
                setIsOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger
                onClick={() => { resetForm(); setIsOpen(true); }}
                className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add New Recipe
              </DialogTrigger>

              <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
                <DialogHeader className="px-6 pt-6 pb-0">
                  <DialogTitle className="font-serif text-xl text-[#1A1A1A]">
                    {editingId ? '✏️ Edit Recipe' : '🍳 Create New Recipe'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Recipe Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Creamy Pasta Carbonara"
                      className="input-fancy w-full px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Cooking Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        required
                        value={formData.cookingTime}
                        onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
                        placeholder="e.g., 30 mins, 1 hour"
                        className="input-fancy w-full pl-10 pr-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Dietary Label
                    </label>
                    <select
                      value={formData.dietaryLabel}
                      onChange={(e) => setFormData({ ...formData, dietaryLabel: e.target.value })}
                      className="input-fancy w-full px-4 py-2.5 text-sm focus:outline-none bg-white appearance-none"
                    >
                      <option value="">None</option>
                      <option>Vegan</option>
                      <option>Vegetarian</option>
                      <option>Keto</option>
                      <option>Dessert</option>
                      <option>Quick Meal</option>
                      <option>Paleo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Recipe Image {!editingId && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required={!editingId}
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="input-fancy w-full px-4 py-2.5 text-sm focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/15 file:text-[#8B6914] hover:file:bg-[#D4AF37]/25"
                    />
                    {editingId && <p className="text-xs text-gray-400 mt-1">Leave empty to keep current image</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-3 rounded-xl text-white font-semibold text-sm mt-2 disabled:opacity-60"
                  >
                    {submitting ? '⏳ Saving...' : editingId ? '💾 Save Changes' : '🍽️ Create Recipe'}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🗑️ Delete this recipe?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-gray-500 px-0 -mt-2">
            This action cannot be undone. The recipe will be permanently removed.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600 border-none"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Recipe Grid */}
      <div className="container mx-auto px-6 max-w-7xl py-10">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-3xl btn-gold flex items-center justify-center shadow-lg animate-float">
              <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
            <p className="text-lg font-bold text-gray-700 font-serif">Your recipe box is empty</p>
            <p className="text-sm text-gray-400">Click "Add New Recipe" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              <div
                key={recipe.id}
                className="recipe-card animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                  <Image
                    src={recipe.image_url || 'https://placehold.co/600x400/F5F3EE/D4AF37?text=🍽️'}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {recipe.dietary_label && (
                    <span className={`absolute top-3 left-3 badge-diet ${getDietColor(recipe.dietary_label)}`}>
                      {recipe.dietary_label}
                    </span>
                  )}
                  {/* Action buttons overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(recipe)}
                      className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center text-blue-600 hover:bg-white shadow-md transition-all hover:scale-110"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold font-serif text-lg text-[#1A1A1A] truncate mb-1">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="badge-time">
                      <Clock className="w-3 h-3" />
                      {recipe.cooking_time}
                    </span>
                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(recipe)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-all"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDeleteId(recipe.id); setIsDeleteOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
