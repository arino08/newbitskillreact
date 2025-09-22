import React, { useState } from "react";
import { Link } from "react-router-dom";
// using in-page anchors for scrolling to sections

function Header() {
  const [searchActive, setSearchActive] = useState(false);

  const openSearch = () => setSearchActive(true);
  const closeSearch = () => setSearchActive(false);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to={"/"} className="logo" aria-label="Bitskill India home">
            <div className="logo-icon">B</div>
            Bitskill India
          </Link>
            <nav aria-label="Main navigation">
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#trending-gigs">Find Gigs</a></li>
                <li><a href="#subscribe">Post a Project</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#key-features">About</a></li>
              </ul>
            </nav>
          <div className="header-actions">
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
            <div className="auth-buttons">
              <Link className="btn btn-outline" to="/login">Login</Link>
              <Link className="btn btn-outline" to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
