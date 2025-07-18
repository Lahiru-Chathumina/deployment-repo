'use client';

import Image from 'next/image';

interface Post {
  title: string;
  description: string;
  image_url?: string;
  user_email?: string;
  created_at: string | Date;
}

interface ModalProps {
  post: Post;
  onClose: () => void;
}

export default function Modal({ post, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group z-10"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {post.image_url && (
          <div className="relative h-80 overflow-hidden">
            <Image
              src={post.image_url}
              alt="Post Image"
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-16">
              <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{post.title}</h2>
            </div>
          </div>
        )}

        <div className="p-8">
          {!post.image_url && (
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {post.title}
            </h2>
          )}

          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {(post.user_email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">Author</p>
              <p className="text-slate-500">
                Posted on{' '}
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg">{post.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
