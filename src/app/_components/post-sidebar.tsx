'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, FileIcon, FolderArchive } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import { type TreeNode } from '@/lib/api'
import { cn } from '@/lib/utils'

type Props = {
  tree: TreeNode[]
  isSheet?: boolean
}

export function PostSidebar({ tree, isSheet = false }: Props) {
  const pathname = usePathname()

  return (
    <nav className="w-full">
      <div className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Posts
      </div>
      <div className="flex flex-col gap-3">
        {tree.map((node) => (
          <SubLink
            key={node.href || node.title}
            node={node}
            level={0}
            pathname={pathname}
            isSheet={isSheet}
          />
        ))}
      </div>
    </nav>
  )
}

function SubLink({
  node,
  level,
  pathname,
  isSheet,
}: {
  node: TreeNode
  level: number
  pathname: string
  isSheet: boolean
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (node.href && pathname !== node.href && pathname.includes(node.href)) {
      setIsOpen(true)
    }
  }

  const isActive = node.href === pathname

  if (!node.items) {
    const link = (
      <Link
        href={node.href!}
        className={cn(
          'flex items-center gap-2 text-sm transition-colors duration-300 ease-in-out',
          isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        )}
        style={{ paddingLeft: level * 16 }}
      >
        <FileIcon size={14} className="shrink-0" />
        {node.title}
      </Link>
    )

    return isSheet ? <SheetClose asChild>{link}</SheetClose> : link
  }

  return (
    <div className="flex flex-col w-full gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 text-sm" style={{ paddingLeft: level * 16 }}>
          <span
            className={cn(
              'flex items-center transition-colors duration-300 ease-in-out',
              isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            <FolderArchive className="size-4 mr-2" /> {node.title}
          </span>
          <CollapsibleTrigger asChild>
            <Button className="ml-auto h-6 w-6 cursor-pointer" variant="link" size="icon">
              {!isOpen ? (
                <ChevronRight className="size-[0.9rem]" />
              ) : (
                <ChevronDown className="size-[0.9rem]" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div
            className={cn(
              'mt-2.5 flex flex-col items-start gap-3 pl-4 text-sm border-l border-border',
              level > 0 && 'ml-1 pl-4 border-l'
            )}
          >
            {node.items?.map((child) => (
              <SubLink
                key={child.href || child.title}
                node={child}
                level={level + 1}
                pathname={pathname}
                isSheet={isSheet}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
