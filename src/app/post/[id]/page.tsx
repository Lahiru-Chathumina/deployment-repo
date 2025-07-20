import { supabase } from '@/app/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function PostDetail({ params }: { params: { id: string } }) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !post) {
    return notFound(); 
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Posted by {post.author_email} on{' '}
          {new Date(post.created_at).toLocaleDateString()}
        </p>

        {post.image_url && (
          <div className="mb-6">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={400}
              className="rounded shadow-md w-full h-auto object-cover"
            />
          </div>
        )}

        <article className="prose prose-lg text-gray-800">
          {post.content}
        </article>
      </div>
    </main>
  );
}
