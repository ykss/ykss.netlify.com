const test = require('node:test')
const assert = require('node:assert/strict')

const {
  filterPostsBySearch,
  getSearchSummaryText,
  highlightSearchText,
} = require('./post-search')

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

test('wraps matched search text while escaping source HTML', () => {
  assert.equal(
    highlightSearchText('React <Hooks> & State', 'hook'),
    'React &lt;<mark class="post-search-highlight">Hook</mark>s&gt; &amp; State'
  )
})

test('leaves text escaped without highlights when search query is blank', () => {
  assert.equal(highlightSearchText('<React>', ''), '&lt;React&gt;')
})

test('builds result summary text for category and search state', () => {
  assert.equal(getSearchSummaryText(12, 'All', ''), '전체 포스트 12개')
  assert.equal(
    getSearchSummaryText(3, 'React', 'hooks'),
    'React 카테고리에서 "hooks" 검색 중 · 3개'
  )
  assert.equal(getSearchSummaryText(2, 'All', 'react'), '"react" 검색 결과 2개')
  assert.equal(getSearchSummaryText(5, 'Web', ''), 'Web 카테고리 포스트 5개')
})
