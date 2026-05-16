import { redirect } from 'next/navigation'
import { getAllPosts } from '@/lib/api'

export default function PostsIndex() {
  const posts = getAllPosts()
  if (posts.length > 0) {
    redirect(`/posts/${posts[0].slug}`)
  }
  return (
    <div className="min-h-dvh flex items-center justify-center text-muted-foreground">
      No hay posts aún.
    </div>
  )
}
