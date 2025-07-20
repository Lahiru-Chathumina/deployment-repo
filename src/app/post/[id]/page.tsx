import { notFound } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', params.id).single()

  if (!post) {
    notFound()
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700">{post.description}</p>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="mt-4 w-full rounded" />
      )}
    </div>
  )
}
