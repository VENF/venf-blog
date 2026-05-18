'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function ImageZoom() {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const article = containerRef.current?.closest('article')
    if (!article) return

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        setSrc((target as HTMLImageElement).src)
        setAlt((target as HTMLImageElement).alt || '')
        setOpen(true)
      }
    }

    article.addEventListener('click', handleClick)
    return () => article.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <div ref={containerRef} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] border-none bg-black/90 p-0 sm:max-w-[80vw]">
          <div className="flex items-center justify-center p-2">
            {src && (
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                unoptimized
                className="max-h-[85vh] w-auto rounded-md object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
