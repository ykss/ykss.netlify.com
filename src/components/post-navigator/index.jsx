import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const PostNavigator = ({ pageContext }) => {
  const { previous, next } = pageContext

  return (
    <nav className="navigator" aria-label="Previous and next posts">
      <div className="navigator__item">
        {previous && (
          <Link className="navigator__link" to={previous.fields.slug} rel="prev">
            <small>Previous</small>
            <span>{previous.frontmatter.title}</span>
          </Link>
        )}
      </div>
      <div className="navigator__item">
        {next && (
          <Link className="navigator__link" to={next.fields.slug} rel="next">
            <small>Next</small>
            <span>{next.frontmatter.title}</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
