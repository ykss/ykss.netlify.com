import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'
import { filterPostsBySearch } from '../../utils/post-search'

export const Contents = ({
  posts,
  countOfInitialPost,
  count,
  category,
  searchQuery,
}) => {
  const refinedPosts = useMemo(
    () =>
      filterPostsBySearch(posts, searchQuery)
        .filter(
          ({ node }) =>
            category === CATEGORY_TYPE.ALL ||
            node.frontmatter.category === category
        )
        .slice(0, count * countOfInitialPost),
    [posts, searchQuery, category, count, countOfInitialPost]
  )

  return (
    <ThumbnailContainer>
      {refinedPosts.length === 0 ? (
        <p className="post-search__empty">No posts found.</p>
      ) : (
        refinedPosts.map(({ node }, index) => (
          <ThumbnailItem node={node} key={`item_${index}`} />
        ))
      )}
    </ThumbnailContainer>
  )
}
