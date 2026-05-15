'use client'

import { useEffect, useRef, useState } from 'react'

export function HeroBanner() {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleData = () => setLoaded(true)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setLoaded(true)
    } else {
      video.addEventListener('loadeddata', handleData)
    }

    return () => video.removeEventListener('loadeddata', handleData)
  }, [])

  return (
    <div className="relative h-[200px] lg:h-[300px] overflow-hidden rounded-lg bg-muted/20">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
          Cargando video...
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        poster="/assets/banner-poster.webp"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/assets/banner.webm" type="video/webm" />
      </video>
    </div>
  )
}
