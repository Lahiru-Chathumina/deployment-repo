'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function FomeCreate() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchPosts(user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchPosts = async (userId: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: false });
    if (data) {
      setPosts(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    if (editingId !== null) {
      const post = posts.find((p) => p.id === editingId);
      if (post?.user_id !== user.id) {
        setError('You can only update your own posts.');
        return;
      }

      await supabase
        .from('posts')
        .update({ title, description })
        .eq('id', editingId);

      setEditingId(null);
    } else {
      const newPost = {
        id: uuidv4(),
        title,
        description,
        user_id: user.id,
        created_at: new Date(),
      };
      await supabase.from('posts').insert([newPost]);
    }

    setTitle('');
    setDescription('');
    fetchPosts(user.id);
  };

  const handleEdit = (post: any) => {
    if (post.user_id !== user.id) {
      setError('You can only edit your own posts.');
      return;
    }

    setTitle(post.title);
    setDescription(post.description);
    setEditingId(post.id);
  };

  const handleDelete = async (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (post?.user_id !== user.id) {
      setError('You can only delete your own posts.');
      return;
    }

    await supabase.from('posts').delete().eq('id', id);
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
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
