export const RightMagnifyingGlassIcon = ({
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
        d="M10 8H9v1h1Zm0 0h1V3h-1Zm-9 4h2v-1H1Zm-1-1h1V9H0Zm1-2h1V8H1Zm2 2h1v-1H3Zm0-2h1V8H3ZM2 8h1V3H2Zm2 2h5V9H4Zm0-3h1V4H4Zm1 1h3V7H5ZM3 3h1V2H3Zm2 1h3V3H5Zm3 3h1V4H8ZM4 2h5V1H4Zm5 1h1V2H9Zm0 0"
      />
    </svg>
  )
}
