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

const HTML_TAG_PATTERN = /(<[^>]+>)/

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

const highlightPlainText = (value, normalizedQuery, shouldEscapeHtml) => {
  const text = String(value || '')

  if (!normalizedQuery) {
    return shouldEscapeHtml ? escapeHtml(text) : text
  }

  const matcher = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi')

  return text
    .split(matcher)
    .map(part => {
      const safePart = shouldEscapeHtml ? escapeHtml(part) : part

      if (normalizeSearchText(part) === normalizedQuery) {
        return `<mark class="post-search-highlight">${safePart}</mark>`
      }

      return safePart
    })
    .join('')
}

const highlightTrustedHtmlText = (value, normalizedQuery) =>
  String(value || '')
    .split(HTML_TAG_PATTERN)
    .map(part => {
      if (part.startsWith('<') && part.endsWith('>')) {
        return part
      }

      return highlightPlainText(part, normalizedQuery, false)
    })
    .join('')

const highlightSearchText = (value, searchQuery, options = {}) => {
  const text = String(value || '')
  const normalizedQuery = normalizeSearchText(searchQuery)
  const { preserveHtml = false } = options

  if (preserveHtml) {
    return highlightTrustedHtmlText(text, normalizedQuery)
  }

  return highlightPlainText(text, normalizedQuery, true)
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

const getSearchState = (resultCount, category, searchQuery) => {
  const normalizedQuery = String(searchQuery || '').trim()
  const isAllCategory = category === 'All'
  const hasActiveFilter = Boolean(normalizedQuery) || !isAllCategory
  const filterLabel = [
    isAllCategory ? null : category,
    normalizedQuery || null,
  ]
    .filter(Boolean)
    .join(' · ')

  return {
    summaryText: getSearchSummaryText(resultCount, category, searchQuery),
    filterLabel: filterLabel || '전체',
    hasActiveFilter,
  }
}

module.exports = {
  filterPostsBySearch,
  getSearchState,
  getSearchSummaryText,
  highlightSearchText,
  normalizeSearchText,
}
