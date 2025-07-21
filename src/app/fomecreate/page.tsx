'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Eye } from 'lucide-react'; 
import Image from 'next/image'; 

interface Post {
  id: number;
  user_id: string;
  title?: string;
  description: string;
  image_url?: string | null;
  user_email?: string;
  created_at?: string;
}

export default function SimplePostManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingPostIdParam = searchParams.get('id');

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(
    editingPostIdParam ? parseInt(editingPostIdParam) : null
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });
      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (error) setError(error.message);
      else setPosts(data || []);
    };
    fetch();
  }, [user, searchTerm]);

  useEffect(() => {
    if (!editingPostId) {
      setTitle('');
      setDescription('');
      setExistingImage(null);
      setImagePreview(null);
      setError('');
      return;
    }

    supabase
      .from('posts')
      .select('*')
      .eq('id', editingPostId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('Post not found');
          setEditingPostId(null);
          return;
        }
        if (user && data.user_id !== user.id) {
          setError('Not authorized to edit this post');
          setEditingPostId(null);
          return;
        }
        setTitle(data.title || '');
        setDescription(data.description);
        setExistingImage(data.image_url);
        setImagePreview(data.image_url);
        setError('');
      });
  }, [editingPostId, user]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('User not found');

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let image_url = existingImage;

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const filename = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('postimage').upload(filename, imageFile);
        if (uploadError) throw new Error('Image upload failed');

        const { data: urlData } = supabase.storage.from('postimage').getPublicUrl(filename);
        image_url = urlData?.publicUrl || null;
      }

      if (editingPostId) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ title, description, image_url })
          .eq('id', editingPostId);

        if (updateError) throw new Error(updateError.message);
        setSuccess('Post updated successfully!');
      } else {
        const { error: insertError } = await supabase.from('posts').insert([
          {
            user_id: user.id,
            user_email: user.email,
            title,
            description,
            image_url,
          },
        ]);
        if (insertError) throw new Error(insertError.message);
        setSuccess('Post created successfully!');
      }

      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setExistingImage(null);
      setEditingPostId(null);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });
      if (!error) setPosts(data || []);
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPostId) return;
    if (!confirm('Are you sure to delete this post?')) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: deleteError } = await supabase.from('posts').delete().eq('id', editingPostId);
      if (deleteError) throw new Error(deleteError.message);

      setSuccess('Post deleted successfully!');
      setEditingPostId(null);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setExistingImage(null);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('id', { ascending: false });
      if (!error) setPosts(data || []);
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Simple Post Manager</h1>

      <div className="mb-4">
        <input
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-md max-h-[400px] overflow-y-auto">
          {posts.length === 0 && <p className="text-gray-500">No posts found</p>}
          {posts.map(post => (
            <div
              key={post.id}
              onClick={() => setEditingPostId(post.id)}
              className={`cursor-pointer p-3 mb-3 rounded border ${
                editingPostId === post.id ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-100'
              }`}
            >
              <h3 className="font-semibold">{post.title || '(No Title)'}</h3>
              <p className="text-sm text-gray-600 truncate">{post.description}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-md shadow-sm">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 border rounded resize-none"
              placeholder="Post description"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Image {editingPostId ? '(optional)' : '(required)'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] ?? null)}
              required={!editingPostId}
            />
          </div>

          {imagePreview && (
            <div>
              <label className="block mb-1 font-semibold flex items-center gap-1">
                <Eye className="w-4 h-4" /> Preview
              </label>
              <div className="w-full h-48 relative">
                <Image
                  src={imagePreview}
                  alt="preview"
                  fill
                  className="rounded object-cover"
                  unoptimized 
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? (editingPostId ? 'Updating...' : 'Creating...') : editingPostId ? 'Update' : 'Create'}
            </button>

            {editingPostId && (
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}