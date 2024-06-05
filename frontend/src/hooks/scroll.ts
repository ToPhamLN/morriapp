import { useRef, useEffect, useState } from 'react'

interface UseScroll {
  elementRef: React.MutableRefObject<HTMLElement | null>
  isHidden: boolean
}

const useScroll = (): UseScroll => {
  const elementRef = useRef<HTMLElement | null>(null)
  const [isHidden, setIsHidden] = useState<boolean>(false)
  useEffect(() => {
    const handleScroll = () => {
      const element = elementRef.current
      if (element) {
        const rect = element.getBoundingClientRect()
        const distanceToTop = rect.top
        const elementHeight = rect.height

        const isExceedingLimit =
          distanceToTop + elementHeight > window.innerHeight

        setIsHidden(isExceedingLimit)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return {
    isHidden,
    elementRef
  }
}

export default useScroll
