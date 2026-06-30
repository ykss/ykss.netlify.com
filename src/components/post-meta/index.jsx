import React from 'react'

import { PostBadges } from '../post-badges'

import './index.scss'

export const PostMeta = ({ date, readingTimeText, hasComments, badges }) => (
  <div className="post-meta">
    <span>{date}</span>
    {readingTimeText && <span>{readingTimeText}</span>}
    <PostBadges badges={badges} />
    {hasComments && (
      <a className="post-meta__comments" href="#post-comments">
        댓글로 이동
      </a>
    )}
  </div>
)
