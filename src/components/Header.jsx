import React, { useState } from "react";

function Header() {
  const [searchActive, setSearchActive] = useState(false);

  const openSearch = () => setSearchActive(true);
  const closeSearch = () => setSearchActive(false);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <a href="#" className="logo" aria-label="Bitskill India home">
            <div className="logo-icon">B</div>
            Bitskill India
          </a>
          <nav aria-label="Main navigation">
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Find Gigs</a>
              </li>
              <li>
                <a href="#">Post a Project</a>
              </li>
              <li>
                <a href="#">How It Works</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
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
              <a className="btn btn-outline" href="login.html">
                Login
              </a>
              <a className="btn btn-outline" href="signup.html">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
