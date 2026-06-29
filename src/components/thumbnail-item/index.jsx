import React from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'
import { highlightSearchText } from '../../utils/post-search'

import './index.scss'

export const ThumbnailItem = ({ node, searchQuery }) => (
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
      <small>{new Date(node.frontmatter.date).toLocaleDateString()}</small>
      <p
        dangerouslySetInnerHTML={{
          __html: highlightSearchText(node.excerpt, searchQuery),
        }}
      />
    </div>
  </Link>
)
