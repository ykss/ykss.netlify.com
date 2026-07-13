import React from 'react'

const badgesStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: '0.35rem',
  alignItems: 'center',
}

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '1.35rem',
  padding: '0.12rem 0.45rem',
  border: '1px solid currentColor',
  borderRadius: '999px',
  fontSize: '0.72rem',
  fontWeight: 700,
  lineHeight: 1.2,
  opacity: 0.8,
}

const getBadgeStyle = tone =>
  Object.assign({}, badgeStyle, {
    opacity: tone === 'short' ? 0.64 : tone === 'long' ? 0.9 : 0.8,
  })

export const PostBadges = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <span className="post-badges" style={badgesStyle} aria-label="Post badges">
      {badges.map(({ label, tone }) => (
        <span
          className={`post-badges__item post-badges__item--${tone}`}
          key={label}
          style={getBadgeStyle(tone)}
        >
          {label}
        </span>
      ))}
    </span>
  )
}
