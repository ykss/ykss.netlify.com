const WORDS_PER_MINUTE = 230
const READING_PROGRESS_PREFIX = 'post-reading-progress:'

const getPostReadingMeta = ({ wordCount }) => {
  const minutes = Math.max(1, Math.ceil(Number(wordCount || 0) / WORDS_PER_MINUTE))

  return {
    readingTimeText: `약 ${minutes}분 읽기`,
  }
}

const getReadingProgressStorageKey = slug =>
  `${READING_PROGRESS_PREFIX}${slug || 'unknown'}`

module.exports = {
  getPostReadingMeta,
  getReadingProgressStorageKey,
}
