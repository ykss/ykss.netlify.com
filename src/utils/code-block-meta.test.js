const assert = require('node:assert/strict')
const test = require('node:test')

const { getCodeBlockMeta } = require('./code-block-meta')

test('extracts language and title from code block attributes', () => {
  assert.deepEqual(
    getCodeBlockMeta({
      className: 'language-tsx',
      dataMeta: 'title=Button.tsx',
    }),
    {
      language: 'tsx',
      title: 'Button.tsx',
    }
  )
})

test('falls back to code when language is missing', () => {
  assert.deepEqual(getCodeBlockMeta({}), {
    language: 'code',
    title: '',
  })
})
