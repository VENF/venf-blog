import { cn } from '@/lib/utils'

type Props = {
  preview?: boolean
}

const Alert = ({ preview }: Props) => {
  if (!preview) return null

  return (
    <div
      className={cn(
        'border-b bg-amber-50 dark:bg-amber-950/20',
        'border-amber-200 dark:border-amber-800'
      )}
    >
      <div className="mx-auto px-5 py-2 text-center text-sm text-amber-800 dark:text-amber-200">
        Este post está en preview — aún no está publicado.
      </div>
    </div>
  )
}

export default Alert
