import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'
import { extractTTSSegments } from '@/lib/tts'
import { PostBody } from '@/app/_components/post-body'
import { PostHeader } from '@/app/_components/post-header'
import { ScrollProgress } from '@/app/_components/scroll-progress'
import { AudioPlayer } from '@/app/_components/audio-player'

type Props = {
  params: Promise<{ slug: string[] }>
}

export default async function Post(props: Props) {
  const params = await props.params
  const slug = params.slug.join('/')
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  const segments = await markdownToHtml(post.content || '')
  const ttsSegments = extractTTSSegments(post.content || '')

  return (
    <>
      <ScrollProgress />
      <div className="min-h-dvh p-3 sm:p-5">
        <div className="mx-auto max-w-5xl mt-[40px]">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
          <PostHeader
            title={post.title}
            date={post.date}
            excerpt={post.excerpt}
            content={post.content || ''}
          />
        </div>
        <div className="mx-auto max-w-4xl">
          <article>
            <hr className="border-t" />
            <AudioPlayer segments={ttsSegments} title={post.title} />
            <div className="relative mt-[40px]">
              <PostBody segments={segments} />
            </div>
          </article>
        </div>
      </div>
    </>
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const slug = params.slug.join('/')
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  return {
    title: `${post.title} | venf`,
    openGraph: {
      title: `${post.title} | venf`,
      images: [post.ogImage.url],
    },
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}
