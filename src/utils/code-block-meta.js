const TITLE_PATTERN = /(?:^|\s)(?:title|filename|file)=["']?([^"'\s]+)["']?/i

const getLanguageFromClassName = className => {
  const languageClass = String(className || '')
    .split(/\s+/)
    .find(name => name.indexOf('language-') === 0)

  return languageClass ? languageClass.replace('language-', '') : 'code'
}

const getCodeBlockMeta = ({ className, dataMeta, dataTitle } = {}) => {
  const meta = String(dataMeta || '')
  const titleMatch = meta.match(TITLE_PATTERN)

  return {
    language: getLanguageFromClassName(className),
    title: dataTitle || (titleMatch ? titleMatch[1] : ''),
  }
}

module.exports = {
  getCodeBlockMeta,
}
