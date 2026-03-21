'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ChefHat, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (isLogin: boolean) => {
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else if (!isLogin) {
      setSuccessMsg('Account created! Check your email to confirm, then log in.');
    } else {
      router.refresh();
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 hero-pattern">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl btn-gold flex items-center justify-center shadow-xl mb-4">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#1A1A1A]">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to manage your recipes</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-fancy w-full pl-10 pr-4 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-fancy w-full pl-10 pr-11 py-3 text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>

          {/* Messages */}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2">
              <span className="mt-0.5">✅</span>
              {successMsg}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              className="btn-gold w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide shadow-md disabled:opacity-60"
              onClick={() => handleAuth(true)}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '🔑 Login'}
            </button>
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold text-gray-600 border-2 border-gray-200 hover:border-[#D4AF37]/50 hover:text-[#8B6914] hover:bg-[#D4AF37]/5 transition-all"
              onClick={() => handleAuth(false)}
              disabled={loading}
            >
              ✨ Create Account
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our Terms of Service
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-gray-400 mt-4">
          CulinaryArt — FER202 Practical Exam Project
        </p>
      </div>
    </div>
  );
}
