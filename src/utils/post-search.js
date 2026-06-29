const normalizeSearchText = value =>
  String(value || '')
    .trim()
    .toLowerCase()

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

module.exports = {
  filterPostsBySearch,
  normalizeSearchText,
}
