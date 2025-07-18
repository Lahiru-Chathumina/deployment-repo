'use client';

import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import PostCard from './components/PostCard';
import CarouselComponent from './components/CarouselComponent';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.header 
            className="mb-8 sm:mb-12 lg:mb-16 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-tight"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: 'linear' 
              }}
            >
              Welcome to the Blog App
            </motion.h1>
            
            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Discover amazing stories, share your thoughts, and connect with a vibrant community of writers and readers.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs sm:text-sm font-medium text-indigo-700">Creative</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-purple-200">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs sm:text-sm font-medium text-purple-700">Trending</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-pink-200">
                <Users className="w-4 h-4 text-pink-600" />
                <span className="text-xs sm:text-sm font-medium text-pink-700">Community</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full border border-blue-200">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-blue-700">Stories</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-6 sm:mb-8"
            >
              <CarouselComponent />
            </motion.div>

            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <div className="h-1 w-6 sm:w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <div className="h-1 w-3 sm:w-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
            </motion.div>
          </motion.header>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
                <div className="relative mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
                </div>
                <p className="text-base sm:text-lg text-slate-600 font-medium">Loading amazing posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <motion.div 
                className="text-center py-12 sm:py-16 lg:py-20 px-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">No posts yet</h3>
                <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">Be the first to share your story with the community!</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
      
      <Footer />

      <motion.div
        className="absolute top-20 right-4 sm:right-8 lg:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 rounded-full opacity-60 pointer-events-none"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 left-4 sm:left-8 lg:left-16 w-4 h-4 sm:w-6 sm:h-6 bg-pink-400 rounded-full opacity-40 pointer-events-none"
        animate={{
          y: [0, -20, 0],
          x: [0, 8, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-1/2 left-2 sm:left-4 lg:left-8 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full opacity-50 pointer-events-none"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </main>
  );
}