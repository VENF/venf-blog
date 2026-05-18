import { parseISO, format } from 'date-fns'
import { es } from 'date-fns/locale'
type Props = {
  dateString: string
}

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString)
  return (
    <time className="text-primary" dateTime={dateString}>
      {format(date, 'MMMM d, yyyy', { locale: es })}
    </time>
  )
}

export default DateFormatter
