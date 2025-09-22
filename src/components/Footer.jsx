import React from "react";

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Bitskill India</h3>
            <p>
              Bridging the gap between Mumbai University students and local
              businesses through micro-internships.
            </p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
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
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Success Stories</a>
              </li>
              <li>
                <a href="#">For Businesses</a>
              </li>
              <li>
                <a href="#">For Students</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <a href="mailto:info@bitskill_india.com">
                  info@bitskill_india.com
                </a>
              </li>
              <li>
                <a href="tel:+912212345678">+91 22 1234 5678</a>
              </li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Bitskill India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
