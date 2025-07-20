import { notFound } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            {post.description}
          </p>
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="mt-6 w-full h-auto object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}
