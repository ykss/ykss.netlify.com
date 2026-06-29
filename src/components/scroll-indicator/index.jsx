import React, { useEffect, useState } from 'react'

import './index.scss'

const getScrollProgress = () => {
  const documentElement = document.documentElement
  const scrollableHeight =
    documentElement.scrollHeight - documentElement.clientHeight

  if (scrollableHeight <= 0) {
    return 0
  }

  return Math.min(window.scrollY / scrollableHeight, 1)
}

export const ScrollIndicator = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrameId

    const updateProgress = () => {
      window.cancelAnimationFrame(animationFrameId)

      animationFrameId = window.requestAnimationFrame(() => {
        setProgress(getScrollProgress())
      })
    }

    updateProgress()

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="scroll-indicator" aria-hidden="true">
      <div
        className="scroll-indicator__bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
