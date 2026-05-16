import 'highlight.js/styles/github-dark.css'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildTree, getAllPosts, getPostBySlug } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'
import Container from '@/app/_components/container'
import { PostBody } from '@/app/_components/post-body'
import { PostHeader } from '@/app/_components/post-header'
import { PostSidebar } from '@/app/_components/post-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Link from 'next/link'
import { ArrowLeft, Menu } from 'lucide-react'

type Props = {
  params: Promise<{ slug: string[] }>
}

export default async function Post(props: Props) {
  const params = await props.params
  const slug = params.slug.join('/')
  const post = getPostBySlug(slug)

  if (!post) return notFound()

  const content = await markdownToHtml(post.content || '')
  const allPosts = getAllPosts()
  const tree = buildTree(allPosts)

  return (
    <div className="min-h-dvh p-3 sm:p-5">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
          <PostSidebar tree={tree} isSheet />
        </SheetContent>
      </Sheet>
      <div className="grid grid-cols-1 lg:grid-cols-[.3fr_1fr] gap-10 p-3 sm:p-5">
        <aside className="hidden lg:block">
          <div className="sticky top-5 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <PostSidebar tree={tree} />
          </div>
        </aside>
        <main>
          <Container>
            <article className="mb-32">
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                excerpt={post.excerpt}
              />
              <PostBody content={content} />
            </article>
          </Container>
        </main>
      </div>
    </div>
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
