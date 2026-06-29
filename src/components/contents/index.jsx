import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'
import {
  filterPostsBySearch,
  getSearchSummaryText,
} from '../../utils/post-search'

export const Contents = ({
  posts,
  countOfInitialPost,
  count,
  category,
  searchQuery,
}) => {
  const filteredPosts = useMemo(
    () =>
      filterPostsBySearch(posts, searchQuery).filter(
        ({ node }) =>
          category === CATEGORY_TYPE.ALL ||
          node.frontmatter.category === category
      ),
    [posts, searchQuery, category]
  )
  const refinedPosts = filteredPosts.slice(0, count * countOfInitialPost)

  return (
    <>
      <p className="post-search__summary">
        {getSearchSummaryText(filteredPosts.length, category, searchQuery)}
      </p>
      <ThumbnailContainer>
        {refinedPosts.length === 0 ? (
          <p className="post-search__empty">검색 결과가 없습니다.</p>
        ) : (
          refinedPosts.map(({ node }, index) => (
            <ThumbnailItem
              node={node}
              searchQuery={searchQuery}
              key={`item_${index}`}
            />
          ))
        )}
      </ThumbnailContainer>
    </>
  )
}
