'use client'

import { useState } from 'react'

interface AlumnusPhotoProps {
  src: string
  name: string
  /** Optional category color (hex) used for the fallback background */
  categoryColor?: string
}

export default function AlumnusPhoto({ src, name, categoryColor = '#1a2e5a' }: AlumnusPhotoProps) {
  const [errored, setErrored] = useState(false)

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  if (errored) {
    return (
      <div
        style={{ backgroundColor: categoryColor, width: '100%', height: '100%' }}
        className="flex items-center justify-center"
      >
        <span
          style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}
        >
          {initials}
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover object-top"
      onError={() => setErrored(true)}
    />
  )
}
