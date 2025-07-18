'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface Post {
  id: string; 
  title: string;
  description: string;
  user_id: string;
  created_at: string | Date;
}

interface User {
  id: string;
  email?: string;
}

export default function FomeCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError('Failed to get user.');
        return;
      }

      setUser(user);
      if (user) {
        fetchPosts(user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch posts error:', error);
        setError('Failed to fetch posts.');
        return;
      }

      if (data) {
        setPosts(data as Post[]); 
      }
    } catch (err) {
      console.error('Unexpected fetchPosts error:', err);
      setError('Unexpected error fetching posts.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    if (editingId !== null) {
      const post = posts.find((p) => p.id === editingId);
      if (!post) {
        setError('Post not found.');
        return;
      }
      if (post.user_id !== user.id) {
        setError('You can only update your own posts.');
        return;
      }

      const { error: updateError } = await supabase
        .from('posts')
        .update({ title, description })
        .eq('id', editingId);

      if (updateError) {
        setError('Failed to update post.');
        return;
      }

      setEditingId(null);
    } else {
      const newPost: Post = {
        id: uuidv4(),
        title,
        description,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('posts').insert([newPost]);

      if (insertError) {
        setError('Failed to create post.');
        return;
      }
    }

    setTitle('');
    setDescription('');
    fetchPosts(user.id);
  };

  const handleEdit = (post: Post) => {
    if (!user) {
      setError('You must be logged in to edit posts.');
      return;
    }

    if (post.user_id !== user.id) {
      setError('You can only edit your own posts.');
      return;
    }

    setTitle(post.title);
    setDescription(post.description);
    setEditingId(post.id);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!user) {
      setError('You must be logged in to delete posts.');
      return;
    }

    const post = posts.find((p) => p.id === id);
    if (!post) {
      setError('Post not found.');
      return;
    }

    if (post.user_id !== user.id) {
      setError('You can only delete your own posts.');
      return;
    }

    const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);

    if (deleteError) {
      setError('Failed to delete post.');
      return;
    }

    fetchPosts(user.id);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? 'Update Post' : 'Create New Post'}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Post' : 'Create Post'}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search your posts..."
        className="w-full p-2 mt-6 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
