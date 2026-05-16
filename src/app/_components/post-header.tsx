import CoverImage from './cover-image'
import DateFormatter from './date-formatter'

type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
}

export function PostHeader({ title, coverImage, date, excerpt }: Props) {
  return (
    <>
      <div className="mb-2 text-sm text-muted-foreground">
        <DateFormatter dateString={date} />
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-8">
        {title}
      </h1>
      <div className="mb-8 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
      <p className="text-lg text-muted-foreground mb-6">{excerpt}</p>
      <hr className="border-t mb-8" />
    </>
  )
}
