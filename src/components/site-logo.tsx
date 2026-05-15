import Image from 'next/image'
import Link from 'next/link'

import { Avatar } from '@/components/ui/avatar'

import logoL from '../../public/assets/venf-logo-l.svg'
import logoD from '../../public/assets/venf-logo-d.svg'

export function SiteLogo() {
  return (
    <Link href="/">
      <Avatar className="rounded-lg size-12 bg-muted/30 after:rounded-lg">
        <Image
          src={logoL}
          alt="venf"
          className="hidden dark:block size-full object-contain p-2.5"
          priority
          width={56}
          height={56}
        />
        <Image
          src={logoD}
          alt="venf"
          className="block dark:hidden size-full object-contain p-2.5"
          priority
          width={56}
          height={56}
        />
      </Avatar>
    </Link>
  )
}
