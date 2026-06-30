import React from 'react'

import './index.scss'

export const PostMeta = ({ date, readingTimeText, hasComments }) => (
  <div className="post-meta">
    <span>{date}</span>
    {readingTimeText && <span>{readingTimeText}</span>}
    {hasComments && (
      <a className="post-meta__comments" href="#post-comments">
        댓글로 이동
      </a>
    )}
  </div>
)
