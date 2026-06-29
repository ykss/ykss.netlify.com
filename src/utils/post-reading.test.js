const assert = require('node:assert/strict')
const test = require('node:test')

const {
  getPostReadingMeta,
  getReadingProgressStorageKey,
} = require('./post-reading')

test('builds post reading meta from word count', () => {
  assert.deepEqual(getPostReadingMeta({ wordCount: 820 }), {
    readingTimeText: '약 4분 읽기',
  })
})

test('uses at least one minute for short posts', () => {
  assert.deepEqual(getPostReadingMeta({ wordCount: 40 }), {
    readingTimeText: '약 1분 읽기',
  })
})

test('builds a stable reading progress key from slug', () => {
  assert.equal(
    getReadingProgressStorageKey('/translation/2026/example-post/'),
    'post-reading-progress:/translation/2026/example-post/'
  )
})
