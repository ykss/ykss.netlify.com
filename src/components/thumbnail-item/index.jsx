import React from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'
import { getPostReadingMeta } from '../../utils/post-reading'
import { highlightSearchText } from '../../utils/post-search'

import './index.scss'

export const ThumbnailItem = ({ node, searchQuery }) => {
  const { readingTimeText } = getPostReadingMeta({
    wordCount: node.wordCount && node.wordCount.words,
  })

  return (
    <Link className={`thumbnail ${TARGET_CLASS}`} to={node.fields.slug}>
      <div key={node.fields.slug}>
        <h3
          dangerouslySetInnerHTML={{
            __html: highlightSearchText(
              node.frontmatter.title || node.fields.slug,
              searchQuery
            ),
          }}
        />
        <small className="thumbnail__meta">
          <span>{new Date(node.frontmatter.date).toLocaleDateString()}</span>
          <span>{readingTimeText}</span>
        </small>
        <p
          dangerouslySetInnerHTML={{
            __html: highlightSearchText(node.excerpt, searchQuery, {
              preserveHtml: true,
            }),
          }}
        />
      </div>
    </Link>
  )
}
