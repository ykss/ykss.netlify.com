import React, { useEffect, useRef, useState } from 'react'

import { getReadingProgressStorageKey } from '../../utils/post-reading'

import './index.scss'

const ENHANCED_CODE_CLASS_NAME = 'post-code-block--enhanced'

const getCodeLanguage = pre => {
  const code = pre.querySelector('code[class*="language-"]')
  const languageClass =
    code &&
    Array.from(code.classList).find(className =>
      className.indexOf('language-') === 0
    )

  return languageClass ? languageClass.replace('language-', '') : 'code'
}

const copyText = async text => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch (error) {
      // Fall back below for HTTP/static preview environments.
    }
  }

  const textarea = document.createElement('textarea')

  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  const didCopy = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!didCopy) {
    throw new Error('Copy command failed')
  }
}

const selectCodeText = pre => {
  const code = pre.querySelector('code') || pre
  const selection = window.getSelection()
  const range = document.createRange()

  range.selectNodeContents(code)
  selection.removeAllRanges()
  selection.addRange(range)
}

const enhanceCodeBlocks = container => {
  const cleanupHandlers = []

  container.querySelectorAll('pre[class*="language-"]').forEach(pre => {
    if (pre.classList.contains(ENHANCED_CODE_CLASS_NAME)) {
      return
    }

    pre.classList.add(ENHANCED_CODE_CLASS_NAME)

    const header = document.createElement('div')
    const label = document.createElement('span')
    const button = document.createElement('button')

    header.className = 'post-code-block__header'
    label.className = 'post-code-block__language'
    label.textContent = getCodeLanguage(pre)
    button.className = 'post-code-block__copy'
    button.type = 'button'
    button.textContent = 'Copy'

    const handleCopy = async () => {
      const code = pre.querySelector('code')
      const text = code ? code.textContent : pre.textContent

      try {
        await copyText(text)
        button.textContent = 'Copied'
        window.setTimeout(() => {
          button.textContent = 'Copy'
        }, 1500)
      } catch (error) {
        selectCodeText(pre)
        button.textContent = 'Selected'
      }
    }

    button.addEventListener('click', handleCopy)
    cleanupHandlers.push(() => button.removeEventListener('click', handleCopy))

    header.appendChild(label)
    header.appendChild(button)
    pre.parentNode.insertBefore(header, pre)
  })

  return () => cleanupHandlers.forEach(cleanup => cleanup())
}

const enhanceHeadingAnchors = container => {
  container.querySelectorAll('h2[id], h3[id]').forEach(heading => {
    if (heading.querySelector('.post-heading-anchor')) {
      return
    }

    const anchor = document.createElement('a')
    anchor.className = 'post-heading-anchor'
    anchor.href = `#${heading.id}`
    anchor.setAttribute('aria-label', `${heading.textContent} 섹션 링크`)
    anchor.textContent = '#'
    heading.appendChild(anchor)
  })
}

export const PostContainer = ({ html, slug }) => {
  const containerRef = useRef(null)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    const cleanupCodeBlocks = enhanceCodeBlocks(container)
    enhanceHeadingAnchors(container)

    return cleanupCodeBlocks
  }, [html])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    const handleImageClick = event => {
      const image = event.target.closest('img')

      if (!image || !container.contains(image)) {
        return
      }

      setLightboxImage({
        alt: image.getAttribute('alt') || '',
        src: image.currentSrc || image.getAttribute('src'),
      })
    }

    container.addEventListener('click', handleImageClick)

    return () => container.removeEventListener('click', handleImageClick)
  }, [])

  useEffect(() => {
    if (!slug || typeof window === 'undefined') {
      return undefined
    }

    const storageKey = getReadingProgressStorageKey(slug)
    const savedPosition = Number(window.sessionStorage.getItem(storageKey) || 0)

    if (!window.location.hash && savedPosition > 120) {
      window.setTimeout(() => {
        window.scrollTo({ top: savedPosition, behavior: 'auto' })
      }, 80)
    }

    let animationFrame = null

    const savePosition = () => {
      if (animationFrame) {
        return
      }

      animationFrame = window.requestAnimationFrame(() => {
        window.sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)))
        animationFrame = null
      })
    }

    window.addEventListener('scroll', savePosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', savePosition)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [slug])

  return (
    <>
      <article
        id="post-content"
        className="post-content"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {lightboxImage && (
        <button
          className="post-image-lightbox"
          type="button"
          onClick={() => setLightboxImage(null)}
          aria-label="이미지 닫기"
        >
          <img src={lightboxImage.src} alt={lightboxImage.alt} />
        </button>
      )}
    </>
  )
}
