'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and redirect accordingly
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUserId = localStorage.getItem('user_id');

    if (token && storedUserId) {
      // User is logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User is not logged in, show landing page
      setIsLoading(false);
    }
  }, [router]);

  // Show landing page for non-logged-in users
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2F3441] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5DA9FF]"></div>
          <p className="mt-4 text-[#9AA0B3]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2F3441] font-sans">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-[#FF6B5C] mb-4">
            The Evolution of Todo App
          </h1>

          {/* Subheading */}
          <p className="text-xl text-[#9AA0B3] mb-12 max-w-2xl">
            Simplify your workflow with smart task management.
          </p>

          {/* Image */}
          <div className="mb-8">
            <Image
              src="/Gemini_Generated_Image_ab693oab693oab69-removebg-preview.png"
              alt="The Evolution of Todo App"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Description */}
          <p className="text-lg text-[#C7CBD6] mb-12 max-w-3xl">
            The Evolution of Todo App helps you organize your tasks and deadlines effortlessly. Add, edit, delete, and complete tasks with ease, so you never miss a thing. Whether it's work, personal goals, or daily chores, TodoApp keeps you on track and productive.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-3 bg-[#FF6B5C] text-white rounded-lg hover:bg-[#e05a4d] transition-all duration-300 font-medium"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 bg-[#3A3F4E] text-[#FFFFFF] rounded-lg hover:bg-[#3C4252] transition-all duration-300 font-medium border border-[#9AA0B3]/50"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}