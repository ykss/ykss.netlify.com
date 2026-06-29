import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const RelatedPosts = ({ posts }) => {
  if (!posts.length) {
    return null
  }

  return (
    <section className="related-posts" aria-labelledby="related-posts-title">
      <h2 id="related-posts-title">Related Posts</h2>
      <ul>
        {posts.map(({ node }) => (
          <li key={node.fields.slug}>
            <Link to={node.fields.slug}>
              <span>{node.frontmatter.title}</span>
              <small>
                {new Date(node.frontmatter.date).toLocaleDateString()}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
