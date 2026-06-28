import React from 'react'
import { DiscussionEmbed } from 'disqus-react'

export const Disqus = ({ post, shortName, siteUrl, slug }) => {
  const url = siteUrl + slug

  return (
    <DiscussionEmbed
      shortname={shortName}
      config={{
        identifier: post.frontmatter.title,
        title: post.frontmatter.title,
        url,
        categoryID: post.frontmatter.category_id,
      }}
    />
  )
}
