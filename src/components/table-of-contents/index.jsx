import React, { useEffect, useMemo, useState } from 'react'

import './index.scss'

const MIN_HEADING_COUNT = 3
const ACTIVE_HEADING_CLASS_NAME = 'post-heading--active'

const getVisibleHeadings = headings =>
  (headings || []).filter(heading => {
    return heading.id && heading.value && [2, 3].includes(heading.depth)
  })

const getTargetById = id => document.getElementById(id)

const TocLinks = ({ headings, activeId }) => (
  <ol className="table-of-contents__list">
    {headings.map(heading => (
      <li
        key={heading.id}
        className={`table-of-contents__item table-of-contents__item--depth-${heading.depth}`}
      >
        <a
          className={
            heading.id === activeId ? 'table-of-contents__link--active' : ''
          }
          href={`#${heading.id}`}
        >
          {heading.value}
        </a>
      </li>
    ))}
  </ol>
)

export const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('')
  const tocHeadings = useMemo(() => getVisibleHeadings(headings), [headings])

  useEffect(() => {
    if (!tocHeadings.length) {
      return undefined
    }

    const headingElements = tocHeadings
      .map(heading => getTargetById(heading.id))
      .filter(Boolean)

    if (!headingElements.length) {
      return undefined
    }

    setActiveId(headingElements[0].id)

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries.find(entry => entry.isIntersecting)

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    )

    headingElements.forEach(heading => observer.observe(heading))

    return () => observer.disconnect()
  }, [tocHeadings])

  useEffect(() => {
    if (!activeId) {
      return undefined
    }

    const headingElements = tocHeadings
      .map(heading => getTargetById(heading.id))
      .filter(Boolean)

    headingElements.forEach(heading => {
      heading.classList.toggle(ACTIVE_HEADING_CLASS_NAME, heading.id === activeId)
    })

    return () => {
      headingElements.forEach(heading => {
        heading.classList.remove(ACTIVE_HEADING_CLASS_NAME)
      })
    }
  }, [activeId, tocHeadings])

  const handleClick = event => {
    const link = event.target.closest('a[href^="#"]')

    if (!link) {
      return
    }

    const href = link.getAttribute('href')
    const target = getTargetById(href.replace(/^#/, ''))

    if (!target) {
      return
    }

    event.preventDefault()

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    window.history.replaceState(null, '', href)
    setActiveId(target.id)
  }

  if (tocHeadings.length < MIN_HEADING_COUNT) {
    return null
  }

  return (
    <>
      <nav
        className="table-of-contents table-of-contents--desktop"
        aria-label="Table of contents"
        onClick={handleClick}
      >
        <div className="table-of-contents__title">Contents</div>
        <TocLinks headings={tocHeadings} activeId={activeId} />
      </nav>
      <details className="table-of-contents table-of-contents--mobile">
        <summary className="table-of-contents__summary">Contents</summary>
        <nav aria-label="Table of contents" onClick={handleClick}>
          <TocLinks headings={tocHeadings} activeId={activeId} />
        </nav>
      </details>
    </>
  )
}
