import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavLinks from "./Pages/components/NavLinks";
import Search from "./Pages/components/Search";
import AuthLinks from "./Pages/components/AuthLinks";
// using in-page anchors for scrolling to sections

function Header({displayNavLinks}) {
  const [searchActive, setSearchActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

          {displayNavLinks && (
            <div className={`nav-wrapper ${menuOpen ? 'open' : ''}`}>
              <NavLinks />
            </div>
          )}

          <div className="header-actions">
            {displayNavLinks && (
              <button
                className={`hamburger ${menuOpen ? 'is-active' : ''}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span />
                <span />
                <span />
              </button>
            )}

            {displayNavLinks && <Search
              searchActive={searchActive}
              openSearch={openSearch}
              closeSearch={closeSearch}
            />}

            <div className="auth-buttons">
              <AuthLinks/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
