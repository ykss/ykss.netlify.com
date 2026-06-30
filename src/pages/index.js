import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Seo } from '../components/head'
import { Category } from '../components/category'
import { Contents } from '../components/contents'
import { PostSearch } from '../components/post-search'

import * as ScrollManager from '../utils/scroll'
import * as Storage from '../utils/storage'
import * as IOManager from '../utils/visible'
import * as EventManager from '../utils/event-manager'
import * as Dom from '../utils/dom'

import { HOME_TITLE, CATEGORY_TYPE } from '../constants'

const DEST_POS = 316
const BASE_LINE = 80

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

const HomePage = ({ data, location }) => {
  const initialCount = Storage.getCount(1)
  const initialCategory = Storage.getCategory(CATEGORY_TYPE.ALL)
  const [count, setCount] = useState(initialCount)
  const countRef = useRef(count)
  const searchInputRef = useRef(null)
  const [category, setCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('q') || ''
  })

  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  const categories = _.uniq(posts.map(({ node }) => node.frontmatter.category))

  useEffect(() => {
    window.addEventListener(`scroll`, onScroll, { passive: false })
    IOManager.init()
    ScrollManager.init()

    return () => {
      window.removeEventListener(`scroll`, onScroll, { passive: false })
      IOManager.destroy()
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    countRef.current = count
    IOManager.refreshObserver()
    Storage.setCount(count)
    Storage.setCategory(category)
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }

    const nextSearch = params.toString()
    const nextUrl = nextSearch
      ? `${window.location.pathname}?${nextSearch}`
      : window.location.pathname

    window.history.replaceState(null, '', nextUrl)
  }, [searchQuery])

  useEffect(() => {
    const onKeyDown = event => {
      const target = event.target
      const isInputTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable

      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !isInputTarget) {
        event.preventDefault()
        searchInputRef.current.focus()
        return
      }

      if (event.key === 'Escape' && searchQuery) {
        event.preventDefault()
        searchPosts('')
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [searchQuery])

  const selectCategory = category => {
    setCategory(category)
    setCount(1)
    ScrollManager.go(DEST_POS)
  }

  const searchPosts = searchQuery => {
    setSearchQuery(searchQuery)
    setCount(1)
  }

  const resetPostFilters = () => {
    setSearchQuery('')
    setCategory(CATEGORY_TYPE.ALL)
    setCount(1)
  }

  const onScroll = () => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(() => setCount(prev => prev + 1), {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  }

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Bio />
      <PostSearch
        searchQuery={searchQuery}
        onSearch={searchPosts}
        inputRef={searchInputRef}
      />
      <Category
        categories={categories}
        category={category}
        selectCategory={selectCategory}
      />
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        category={category}
        searchQuery={searchQuery}
        onResetFilters={resetPostFilters}
      />
    </Layout>
  )
}

export default HomePage

export const Head = ({ data }) => {
  const { siteMetadata } = data.site

  return (
    <Seo
      title={HOME_TITLE}
      keywords={siteMetadata.keywords}
      siteMetadata={siteMetadata}
    />
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
        keywords
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          wordCount {
            words
          }
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            draft
          }
        }
      }
    }
  }
`
