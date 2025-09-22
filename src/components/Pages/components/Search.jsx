import React from 'react'

const Search = ({searchActive, openSearch, closeSearch}) => {
  return (
    <>
    <div
              className={`search-wrapper${searchActive ? " active" : ""}`}
              title="Search Bitskill"
            >
              <input
                className="search-input"
                type="text"
                placeholder="Search Bitskill..."
                aria-label="Search"
              />
              <button
                className="search-icon"
                onClick={openSearch}
                aria-label="Open search"
              >
                <i className="fas fa-search"></i>
              </button>
              <button
                className="close-btn"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
    </>
  )
}

export default Search