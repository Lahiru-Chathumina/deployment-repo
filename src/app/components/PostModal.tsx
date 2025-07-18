'use client';

import { X } from 'lucide-react';


interface PostModalProps {
  post: any;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="overflow-y-auto max-h-[90vh]">
          {post.image_url && (
            <div className="relative h-80 overflow-hidden">
              <img
                src={post.image_url}
                alt={post.title || 'Post image'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-16">
                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {post.title}
                </h2>
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
                <p className="font-semibold text-slate-800 text-lg">
                  {post.user_email || 'Unknown Author'}
                </p>
                <p className="text-slate-500">
                  Published on {new Date(post.created_at).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                {post.description}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
        >
          <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}