const SHORT_POST_WORD_LIMIT = 800
const LONG_POST_WORD_LIMIT = 2200

const getLengthBadge = wordCount => {
  const words = Number(wordCount) || 0

  if (words >= LONG_POST_WORD_LIMIT) {
    return { label: '긴 글', tone: 'long' }
  }

  if (words > 0 && words <= SHORT_POST_WORD_LIMIT) {
    return { label: '짧은 글', tone: 'short' }
  }

  return null
}

const getPostBadges = ({ category, wordCount }) =>
  [
    category ? { label: category, tone: 'category' } : null,
    getLengthBadge(wordCount),
  ].filter(Boolean)

module.exports = {
  getPostBadges,
}
