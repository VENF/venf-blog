import React from 'react'

const LinkSymbolIcon = ({
  size = 100,
  color = '#000000',
  strokeWidth = 0,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
}) => {
  const transforms = []
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
  if (flipHorizontal) transforms.push('scaleX(-1)')
  if (flipVertical) transforms.push('scaleY(-1)')

  const viewBoxSize = 13 + padding * 2
  const viewBoxOffset = -padding
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: size,
        height: size,
        opacity,
        transform: transforms.join(' ') || undefined,
        filter:
          shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined,
      }}
    >
      <path
        fill="currentColor"
        d="M4 7h1V6h1V5H5V4H4Zm-4 4h1V8H0Zm1 1h3v-1H1Zm3-1h1v-1H4ZM1 8h1V7H1Zm4 2h1V9H5ZM2 7h1V6H2Zm4 2h1V6H6v1H5v1h1Zm2-2h1V6H8ZM5 4h1V3H5Zm4 2h1V5H9ZM6 3h1V2H6Zm4 2h1V2h-1ZM7 2h3V1H7Zm0 0"
      />
    </svg>
  )
}

export default LinkSymbolIcon
