const normalizeSearchText = value =>
  String(value || '')
    .trim()
    .toLowerCase()

const escapeHtml = value =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getSearchableText = post => {
  const node = post && post.node ? post.node : {}
  const frontmatter = node.frontmatter || {}

  return normalizeSearchText(
    [frontmatter.title, node.excerpt, frontmatter.category].join(' ')
  )
}

const filterPostsBySearch = (posts, searchQuery) => {
  const normalizedQuery = normalizeSearchText(searchQuery)

  if (!normalizedQuery) {
    return posts
  }

  return posts.filter(post => getSearchableText(post).includes(normalizedQuery))
}

const highlightSearchText = (value, searchQuery) => {
  const text = String(value || '')
  const normalizedQuery = normalizeSearchText(searchQuery)

  if (!normalizedQuery) {
    return escapeHtml(text)
  }

  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi')

  return text
    .split(matcher)
    .map(part => {
      const escapedPart = escapeHtml(part)

      if (normalizeSearchText(part) === normalizedQuery) {
        return `<mark class="post-search-highlight">${escapedPart}</mark>`
      }

      return escapedPart
    })
    .join('')
}

const getSearchSummaryText = (resultCount, category, searchQuery) => {
  const normalizedQuery = String(searchQuery || '').trim()
  const isAllCategory = category === 'All'

  if (normalizedQuery && !isAllCategory) {
    return `${category} 카테고리에서 "${normalizedQuery}" 검색 중 · ${resultCount}개`
  }

  if (normalizedQuery) {
    return `"${normalizedQuery}" 검색 결과 ${resultCount}개`
  }

  if (!isAllCategory) {
    return `${category} 카테고리 포스트 ${resultCount}개`
  }

  return `전체 포스트 ${resultCount}개`
}

module.exports = {
  filterPostsBySearch,
  getSearchSummaryText,
  highlightSearchText,
  normalizeSearchText,
}
