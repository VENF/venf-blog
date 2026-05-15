export const BeerMugIcon = ({
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
      className=""
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
        d="M8 11H3v1h5Zm0 0h1v-1h2V5H9V4h1V2H9v1H5v1h3Zm-6 0h1V6H2V2H1v5h1Zm2-1h1V7H4ZM3 6h1V5h1V4H3Zm3 4h1V5H6Zm3-1V6h1v3ZM2 2h7V1H2Zm0 0"
      />
    </svg>
  )
}
