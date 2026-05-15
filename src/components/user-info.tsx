import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function UserInfo() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>VN</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">Victor Naranjo</p>
        <p className="text-xs text-muted-foreground">victornar97@gmail.com</p>
      </div>
    </div>
  )
}
