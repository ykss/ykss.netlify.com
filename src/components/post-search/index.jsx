import React from 'react'

import './index.scss'

export const PostSearch = ({ searchQuery, onSearch }) => (
  <form className="post-search" role="search" onSubmit={event => event.preventDefault()}>
    <label className="post-search__label" htmlFor="post-search">
      Search
    </label>
    <div className="post-search__control">
      <input
        id="post-search"
        className="post-search__input"
        type="search"
        value={searchQuery}
        onChange={event => onSearch(event.target.value)}
        placeholder="Search posts"
        autoComplete="off"
      />
      {searchQuery && (
        <button
          className="post-search__clear"
          type="button"
          aria-label="Clear search"
          onClick={() => onSearch('')}
        >
          x
        </button>
      )}
    </div>
  </form>
)
