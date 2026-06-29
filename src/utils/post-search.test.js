const test = require('node:test')
const assert = require('node:assert/strict')

const { filterPostsBySearch } = require('./post-search')

const posts = [
  {
    node: {
      excerpt: 'React rendering and state management notes',
      frontmatter: {
        title: 'React Hooks Guide',
        category: 'react',
      },
    },
  },
  {
    node: {
      excerpt: 'Practical static site generation with Gatsby',
      frontmatter: {
        title: 'Building a Blog',
        category: 'web',
      },
    },
  },
]

test('returns every post when search query is blank', () => {
  assert.deepEqual(filterPostsBySearch(posts, '   '), posts)
})

test('matches posts by title, excerpt, and category', () => {
  assert.equal(filterPostsBySearch(posts, 'hooks').length, 1)
  assert.equal(filterPostsBySearch(posts, 'static site')[0], posts[1])
  assert.equal(filterPostsBySearch(posts, 'WEB')[0], posts[1])
})

test('returns no posts when the query does not match searchable fields', () => {
  assert.deepEqual(filterPostsBySearch(posts, 'typescript'), [])
})
