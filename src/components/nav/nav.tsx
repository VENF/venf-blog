'use client'
import { usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { SiteLogo } from '@/components/site-logo'
import { SwitchTheme } from '@/components/switch-theme'

import { NavLink } from './nav-link'
import { BeerMugIcon } from '../icons/Beer'
import { CodeIcon } from '../icons/Code'
import { DogFaceIcon } from '../icons/Dog'
import { GithubIcon } from '../icons/Github'
import LinkSymbolIcon from '../icons/Link'

const navLinks = [
  { href: '/', label: 'Inicio', icon: BeerMugIcon },
  { href: '/code', label: 'Código', icon: CodeIcon },
  { href: '/blog', label: 'Blog', icon: DogFaceIcon },
] as const

const externalLinks = [
  {
    href: 'https://www.linkedin.com/in/venf',
    label: 'LinkedIn',
    icon: GithubIcon,
  },
  {
    href: 'https://github.com/VENF',
    label: 'GitHub',
    icon: LinkSymbolIcon,
  },
] as const

export function Nav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <NavigationMenu className="w-full max-w-full flex justify-end" viewport={false}>
      <NavigationMenuList className="flex-col items-start gap-1 w-full p-0">
        <div className="mb-6">
          <SiteLogo />
        </div>
        {navLinks.map((link) => (
          <NavigationMenuItem key={link.href} className="w-full">
            <NavLink
              href={link.href}
              label={link.label.toLocaleUpperCase()}
              icon={link.icon}
              isActive={isActive(link.href)}
            />
          </NavigationMenuItem>
        ))}
        <Separator className="w-full my-2" />
        {externalLinks.map((link) => (
          <NavigationMenuItem key={link.href} className="w-full">
            <NavLink
              href={link.href}
              label={link.label.toLocaleUpperCase()}
              icon={link.icon}
              isActive={false}
              isExternal
            />
          </NavigationMenuItem>
        ))}
        <div className="my-2">
          <SwitchTheme />
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
