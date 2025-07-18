'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export default function FomeCreate() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchPosts();
      } else {
        router.push('/login');
      }
    };
    getUser();
  }, [router]);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false });
    if (data) {
      setPosts(data);
    }
  };

  const handlePost = async () => {
    if (!title || !description || !imageFile) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    const fileName = `${uuidv4()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('postimage')
      .upload(`images/${fileName}`, imageFile, {
        contentType: imageFile.type,
      });

    if (uploadError) {
      setError('Error uploading image: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase
      .storage
      .from('postimage')
      .getPublicUrl(`images/${fileName}`);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from('posts').insert([
      {
        user_id: user.id,
        user_email: user.email,
        title,
        description,
        image_url: imageUrl,
      },
    ]);

    if (dbError) {
      setError('Error saving post: ' + dbError.message);
    } else {
      setTitle('');
      setDescription('');
      setImageFile(null);
      fetchPosts();
    }

    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setDescription(post.description);
    setEditingId(post.id);
  };

  const handleUpdate = async () => {
    if (!title || !description) {
      setError('Please enter updated title and description');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('posts')
      .update({ title, description })
      .eq('id', editingId);

    if (error) {
      setError('Error updating post: ' + error.message);
    } else {
      setTitle('');
      setDescription('');
      setEditingId(null);
      fetchPosts();
    }
    setLoading(false);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">{editingId ? 'Update Post' : 'Create Post'}</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <input
        type="text"
        placeholder="Enter title..."
        className="w-full p-2 border mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write something..."
        className="w-full p-2 border mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {!editingId && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
      )}

      <button
        onClick={editingId ? handleUpdate : handlePost}
        className={`bg-${editingId ? 'yellow' : 'blue'}-500 text-white px-4 py-2 rounded mr-2`}
        disabled={loading}
      >
        {loading ? 'Saving...' : editingId ? 'Update' : 'Post'}
      </button>

      {editingId && (
        <button
          onClick={() => {
            setEditingId(null);
            setTitle('');
            setDescription('');
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      )}

      <hr className="my-6" />
      <input
        type="text"
        placeholder="🔍 Search by title..."
        className="w-full p-2 border mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="border p-4 rounded bg-gray-50 shadow-sm">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{post.description}</p>
            <p className="text-xs text-gray-500">📧 {post.user_email}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(post)}
                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
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
