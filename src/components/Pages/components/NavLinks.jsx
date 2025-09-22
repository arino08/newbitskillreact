import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            {isHomePage ? (
              <a href="#hero">Home</a>
            ) : (
              <Link to="/">Home</Link>
            )}
          </li>
          <li>
            <Link to="/gigs">Find Gigs</Link>
          </li>
          <li>
            <Link to="/post-gig">Post a Gig</Link>
          </li>
          <li>
            {isHomePage ? (
              <a href="#how-it-works">How It Works</a>
            ) : (
              <Link to="/#how-it-works">How It Works</Link>
            )}
          </li>
          <li>
            {isHomePage ? (
              <a href="#key-features">About</a>
            ) : (
              <Link to="/#key-features">About</Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavLinks;
