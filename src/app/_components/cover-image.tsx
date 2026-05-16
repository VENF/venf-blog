import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ title, src, slug }: Props) => {
  if (!src) return null

  const image = (
    <Image
      src={src}
      alt={`Portada para ${title}`}
      className={cn('shadow-sm w-full h-[300px] object-cover rounded-[8px]', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={800}
      height={300}
      loading="eager"
    />
  )

  if (slug) {
    return (
      <Link href={`/posts/${slug}`} aria-label={title}>
        {image}
      </Link>
    )
  }

  return <div className="w-full">{image}</div>
}

export default CoverImage
