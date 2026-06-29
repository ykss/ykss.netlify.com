const assert = require('node:assert/strict')
const test = require('node:test')

const {
  buildBlogPostingJsonLd,
  getRelatedPosts,
} = require('./post-recommendations')

const createPost = ({ slug, title, category, date }) => ({
  node: {
    fields: { slug },
    excerpt: `${title} excerpt`,
    frontmatter: {
      title,
      category,
      date,
    },
  },
})

test('returns latest related posts from the same category excluding the current post', () => {
  const posts = [
    createPost({
      slug: '/react/current/',
      title: 'Current React Post',
      category: 'React',
      date: '2026-06-01',
    }),
    createPost({
      slug: '/react/newest/',
      title: 'Newest React Post',
      category: 'React',
      date: '2026-06-20',
    }),
    createPost({
      slug: '/react/older/',
      title: 'Older React Post',
      category: 'React',
      date: '2026-05-10',
    }),
    createPost({
      slug: '/javascript/other/',
      title: 'Other Category Post',
      category: 'JavaScript',
      date: '2026-06-25',
    }),
  ]

  assert.deepEqual(
    getRelatedPosts(posts, {
      slug: '/react/current/',
      category: 'React',
      limit: 2,
    }).map(post => post.node.fields.slug),
    ['/react/newest/', '/react/older/']
  )
})

test('fills related posts with latest posts when the same category has fewer matches', () => {
  const posts = [
    createPost({
      slug: '/react/current/',
      title: 'Current React Post',
      category: 'React',
      date: '2026-06-01',
    }),
    createPost({
      slug: '/react/related/',
      title: 'Related React Post',
      category: 'React',
      date: '2026-06-20',
    }),
    createPost({
      slug: '/javascript/latest/',
      title: 'Latest JavaScript Post',
      category: 'JavaScript',
      date: '2026-06-25',
    }),
    createPost({
      slug: '/web/older/',
      title: 'Older Web Post',
      category: 'Web',
      date: '2026-05-10',
    }),
  ]

  assert.deepEqual(
    getRelatedPosts(posts, {
      slug: '/react/current/',
      category: 'React',
      limit: 3,
    }).map(post => post.node.fields.slug),
    ['/react/related/', '/javascript/latest/', '/web/older/']
  )
})

test('builds BlogPosting JSON-LD for a post', () => {
  assert.deepEqual(
    buildBlogPostingJsonLd({
      author: 'ykss',
      canonicalUrl: 'https://ykss.netlify.app/custom-canonical/',
      datePublished: '2026-06-29',
      description: 'Structured data excerpt',
      image: 'https://ykss.netlify.app/thumbnail.png',
      siteUrl: 'https://ykss.netlify.app',
      title: 'Structured Data Post',
      url: 'https://ykss.netlify.app/posts/structured-data/',
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Structured Data Post',
      description: 'Structured data excerpt',
      image: ['https://ykss.netlify.app/thumbnail.png'],
      datePublished: '2026-06-29',
      dateModified: '2026-06-29',
      author: {
        '@type': 'Person',
        name: 'ykss',
      },
      publisher: {
        '@type': 'Person',
        name: 'ykss',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://ykss.netlify.app/custom-canonical/',
      },
      url: 'https://ykss.netlify.app/custom-canonical/',
      isPartOf: {
        '@type': 'Blog',
        url: 'https://ykss.netlify.app',
      },
    }
  )
})
