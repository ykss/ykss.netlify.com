import React from 'react'

export const PostBadges = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <span className="post-badges" aria-label="Post badges">
      {badges.map(({ label, tone }) => (
        <span
          className={`post-badges__item post-badges__item--${tone}`}
          key={label}
        >
          {label}
        </span>
      ))}
    </span>
  )
}
