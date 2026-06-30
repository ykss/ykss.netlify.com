import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'
import {
  filterPostsBySearch,
  getSearchState,
} from '../../utils/post-search'

export const Contents = ({
  posts,
  countOfInitialPost,
  count,
  category,
  searchQuery,
  onResetFilters,
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
  const searchState = getSearchState(filteredPosts.length, category, searchQuery)

  return (
    <>
      <div className="post-search__summary">
        <span>{searchState.summaryText}</span>
        <span className="post-search__filter">{searchState.filterLabel}</span>
        {searchState.hasActiveFilter && (
          <button
            className="post-search__reset"
            type="button"
            onClick={onResetFilters}
          >
            초기화
          </button>
        )}
      </div>
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
