import React from 'react'

import { Bio } from '../bio'
import { PostNavigator } from '../post-navigator'
import { RelatedPosts } from '../related-posts'

import './index.scss'

export const PostFooterActions = ({ hasComments, pageContext, relatedPosts }) => (
  <section className="post-footer-actions" aria-label="Post actions">
    <RelatedPosts posts={relatedPosts} />
    <PostNavigator pageContext={pageContext} />
    <Bio />
    {hasComments && (
      <div className="post-footer-actions__comments">
        <a href="#post-comments">댓글로 이동</a>
      </div>
    )}
  </section>
)
