import { useState, useEffect, MouseEvent } from 'react'

interface HoverPosition {
  top: number
  left: number
}

interface HoverHook {
  isHovered: boolean
  hoverPosition: HoverPosition
  handleMouseEnter: (event: MouseEvent<HTMLElement>) => void
  handleMouseLeave: () => void
}

const useHover = (): HoverHook => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [hoverPosition, setHoverPosition] =
    useState<HoverPosition>({ top: 0, left: 0 })

  const handleMouseEnter = (
    event: MouseEvent<HTMLElement>
  ) => {
    const { top, left } =
      event.currentTarget.getBoundingClientRect()
    setHoverPosition({
      top: window.scrollY + top,
      left: window.scrollX + left
    })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    return () => {}
  }, [])

  return {
    isHovered,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave
  }
}

export default useHover
