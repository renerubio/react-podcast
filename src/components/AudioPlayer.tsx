'use client'

export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio
      controls
      preload="none"
      src={src}
      style={{ width: '100%' }}
      crossOrigin="anonymous"
    />
  )
}
