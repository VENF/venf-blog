'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { BeerMugIcon } from '../icons/Beer'
import { CodeIcon } from '../icons/Code'
import { DogFaceIcon } from '../icons/Dog'
import { GithubIcon } from '../icons/Github'
import LinkSymbolIcon from '../icons/Link'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', icon: BeerMugIcon, label: 'Inicio' },
  { href: '/code', icon: CodeIcon, label: 'Código' },
  { href: '/blog', icon: DogFaceIcon, label: 'Blog' },
  {
    href: 'https://www.linkedin.com/in/venf',
    icon: LinkSymbolIcon,
    label: 'LinkedIn',
    external: true,
  },
  { href: 'https://github.com/VENF', icon: GithubIcon, label: 'GitHub', external: true },
]

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-background/70 backdrop-blur-xl border-t border-border/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cn(
              'flex items-center justify-center size-10 rounded-lg transition-colors',
              isActive(item.href)
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground/80'
            )}
          >
            <item.icon size={22} />
            <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
