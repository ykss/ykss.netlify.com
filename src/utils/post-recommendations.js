const toTime = value => {
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

const getPostCategory = post =>
  post && post.node && post.node.frontmatter
    ? post.node.frontmatter.category
    : undefined

const getPostSlug = post =>
  post && post.node && post.node.fields ? post.node.fields.slug : undefined

const sortByNewest = posts =>
  posts
    .sort(
      (firstPost, secondPost) =>
        toTime(secondPost.node.frontmatter.date) -
        toTime(firstPost.node.frontmatter.date)
    )

const getRelatedPosts = (posts, { slug, category, limit = 3 }) => {
  const candidates = sortByNewest(
    (posts || []).filter(post => getPostSlug(post) !== slug)
  )
  const sameCategoryPosts = candidates.filter(
    post => getPostCategory(post) === category
  )
  const fallbackPosts = candidates.filter(
    post => getPostCategory(post) !== category
  )

  return sameCategoryPosts.concat(fallbackPosts).slice(0, limit)
}

const buildBlogPostingJsonLd = ({
  author,
  canonicalUrl,
  dateModified,
  datePublished,
  description,
  image,
  siteUrl,
  title,
  url,
}) => {
  const pageUrl = canonicalUrl || url
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    isPartOf: {
      '@type': 'Blog',
      url: siteUrl,
    },
  }

  if (image) {
    jsonLd.image = [image]
  }

  return jsonLd
}

module.exports = {
  buildBlogPostingJsonLd,
  getRelatedPosts,
}
