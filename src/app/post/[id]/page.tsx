import { supabase } from '@/app/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
}

export default async function PostDetailPage({ params }: PageProps): Promise<ReactElement> {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!post || error) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-600 mt-4">{post.description}</p>
    </div>
  );
}
