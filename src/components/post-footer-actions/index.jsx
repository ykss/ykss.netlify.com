import React from 'react'

import { Bio } from '../bio'
import { PostNavigator } from '../post-navigator'
import { RelatedPosts } from '../related-posts'

import './index.scss'

export const PostFooterActions = ({
  feedbackUrl,
  hasComments,
  pageContext,
  relatedPosts,
}) => (
  <section className="post-footer-actions" aria-label="Post actions">
    <RelatedPosts posts={relatedPosts} />
    <PostNavigator pageContext={pageContext} />
    {feedbackUrl && (
      <div className="post-footer-actions__feedback">
        <a href={feedbackUrl} target="_blank" rel="noreferrer">
          오타/피드백 제안
        </a>
      </div>
    )}
    <Bio />
    {hasComments && (
      <div className="post-footer-actions__comments">
        <a href="#post-comments">댓글로 이동</a>
      </div>
    )}
  </section>
)
