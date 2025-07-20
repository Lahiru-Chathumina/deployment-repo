'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string | number;
  title?: string;
  description?: string;
  image_url?: string;
  user_email?: string;
  created_at?: string | Date;
}

export default function PostCard({ post }: { post: Post }) {
  const preview = post?.description
    ? post.description.length > 100
      ? post.description.slice(0, 100) + '...'
      : post.description
    : 'No description';

  const isPremiumUser = post.user_email?.endsWith('@premium.com');
  console.log('Email:', post.user_email, 'Is Premium:', isPremiumUser);

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200/60 hover:border-indigo-200 hover:-translate-y-1 cursor-pointer">
        {post.image_url && (
          <div className="relative overflow-hidden h-52 sm:h-60">
            <Image
              src={post.image_url}
              alt={post.title || 'Post image'}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center relative shadow">
              <span className="text-white text-sm font-semibold">
                {isPremiumUser ? `⭐ ${post.user_email?.split('@')[0]}` : (post.user_email || 'U').charAt(0).toUpperCase()}
              </span>
              {isPremiumUser && (
                <span
                  title="Premium User"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white"
                >
                  ★
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{post.user_email || 'Unknown User'}</p>
              <p className="text-xs text-gray-400">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Unknown Date'}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
            {post.title || 'Untitled Post'}
          </h3>

          <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-5">{preview}</p>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
              Read more
              <svg
                className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>

            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full" />
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <div className="w-2 h-2 bg-pink-400 rounded-full" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
