import { ReadingTime } from './reading-time'
import DateFormatter from './date-formatter'

type Props = {
  title: string
  date: string
  excerpt: string
  content: string
}

export function PostHeader({ title, date, excerpt, content }: Props) {
  return (
    <div className="space-y-8 py-[48px]">
      <div className="flex items-center justify-center gap-3 text-sm">
        <DateFormatter dateString={date} />
        <span aria-hidden="true">·</span>
        <ReadingTime content={content} />
      </div>
      <h1 className="text-center text-3xl md:text-5xl lg:text-5xl font-bold tracking-tighter leading-tight">
        {title}
      </h1>
      <div className="flex items-center justify-center">
        <p className="text-lg text-center w-[70%] text-muted-foreground">{excerpt}</p>
      </div>
    </div>
  )
}
