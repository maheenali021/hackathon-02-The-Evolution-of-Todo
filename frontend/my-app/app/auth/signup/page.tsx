'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !email.trim()) {
      setError('User ID and email are required');
      return;
    }

    try {
      setError('');
      await apiClient.signup(userId, email, name || undefined);

      // Redirect to dashboard after signup
      router.push('/dashboard');
      router.refresh(); // Refresh to update the UI
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#2F3441] font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-[#3C4252]/90 backdrop-blur-lg rounded-xl border border-[#9AA0B3]/50 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF6B5C] mb-2">
              The Evolution of Todo App
          </h1>
          <p className="text-[#9AA0B3]">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-[#5DA9FF] mb-2">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF6B5C]"
              placeholder="Enter your user ID"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#5DA9FF] mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF6B5C]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-[#5DA9FF] mb-2">Name (optional)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#3A3F4E]/50 border border-[#9AA0B3]/50 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#FF6B5C]"
              placeholder="Enter your name"
            />
          </div>

          {error && (
            <div className="text-[#FF5C5C] text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#FF6B5C] text-white rounded-lg hover:bg-[#e05a4d] transition-all duration-300 font-medium"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#9AA0B3]">
          <p>Already have an account? <Link href="/auth/login" className="text-[#5DA9FF] hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}