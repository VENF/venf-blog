'use client'

import { useState, useCallback } from 'react'

export function HeroBanner() {
  const [loaded, setLoaded] = useState(false)
  const videoRef = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setLoaded(true)
    }
    const handleData = () => setLoaded(true)
    video.addEventListener('loadeddata', handleData)
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
        poster="/assets/poster.webp"
        className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src="/assets/main.webm" type="video/webm" />
      </video>
    </div>
  )
}
