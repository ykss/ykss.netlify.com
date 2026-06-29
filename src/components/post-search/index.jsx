import React from 'react'

import './index.scss'

export const PostSearch = ({ searchQuery, onSearch }) => (
  <form
    className="post-search"
    role="search"
    onSubmit={event => event.preventDefault()}
  >
    <label className="post-search__label" htmlFor="post-search">
      포스트 검색
    </label>
    <div className="post-search__control">
      <input
        id="post-search"
        className="post-search__input"
        type="search"
        value={searchQuery}
        onChange={event => onSearch(event.target.value)}
        placeholder="포스트 검색하기"
        autoComplete="off"
      />
      {searchQuery && (
        <button
          className="post-search__clear"
          type="button"
          aria-label="Clear search"
          onClick={() => onSearch('')}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  </form>
)
