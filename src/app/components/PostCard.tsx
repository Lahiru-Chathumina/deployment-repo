'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Star } from 'lucide-react';

interface Post {
  id: string | number;
  title?: string;
  description?: string;
  image_url?: string;
  user_email?: string;
  created_at?: string | Date;
}

export default function PostCard({ post }: { post: Post }) {
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const preview =
    post?.description && post.description.length > 150
      ? post.description.slice(0, 150) + '...'
      : post?.description || 'No description available';

  const getUserInitials = (email?: string) => {
    if (!email) return 'U';
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Unknown Date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    async function fetchPremiumStatus() {
      if (!post.user_email) return;
      setIsLoading(true);

      try {
        const res = await fetch(`/api/checkPremium?email=${encodeURIComponent(post.user_email)}`);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data = await res.json();
        setIsPremiumUser(data.isPremium || false);
      } catch (err) {
        console.error('Failed to fetch premium status:', err);
        setIsPremiumUser(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPremiumStatus();
  }, [post.user_email]);

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-100 shadow hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {post.image_url && (
          <div className="relative h-52 sm:h-60 md:h-48 lg:h-56 xl:h-60 bg-gray-100 overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title || 'Post image'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            {isPremiumUser && (
              <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-white" />
                Premium
              </div>
            )}
          </div>
        )}

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">
                {getUserInitials(post.user_email)}
              </div>
              {isLoading && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full animate-pulse border border-white" />
              )}
              {isPremiumUser && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center border-2 border-white">
                  <Star className="w-2.5 h-2.5 text-white fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">
                {post.user_email?.split('@')[0] || 'Unknown'}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(post.created_at)}
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
            {post.title || 'Untitled Post'}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-3">{preview}</p>

          <div className="flex justify-between items-center pt-2">
            <span className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              Read more
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
