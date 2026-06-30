const assert = require('node:assert/strict')
const test = require('node:test')

const { getPostBadges } = require('./post-badges')

test('builds category and length badges for a short post', () => {
  assert.deepEqual(
    getPostBadges({
      category: 'React',
      wordCount: 620,
    }),
    [
      { label: 'React', tone: 'category' },
      { label: '짧은 글', tone: 'short' },
    ]
  )
})

test('builds a long-form badge for long posts', () => {
  assert.deepEqual(
    getPostBadges({
      category: 'JavaScript',
      wordCount: 2600,
    }),
    [
      { label: 'JavaScript', tone: 'category' },
      { label: '긴 글', tone: 'long' },
    ]
  )
})
