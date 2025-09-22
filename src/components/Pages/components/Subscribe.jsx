import React, { useState } from "react";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thanks! You are subscribed with ${email}${phone ? " / " + phone : ""}`
    );
    setEmail("");
    setPhone("");
    setConsent(false);
  };

  return (
    <div className="container section-container" aria-label="Subscribe section">
      <h2
        style={{
          fontWeight: 900,
          margin: "0 0 8px 0",
          color: "white",
          textAlign: "center",
        }}
      >
        Join Our Community
      </h2>
      <p style={{ margin: 0, color: "var(--muted)", textAlign: "center" }}>
        By joining our mailing list, you’ll be the first to know about our
        newest features, exclusive discounts, and upcoming events. Stay informed
        and connected with us.
      </p>
      <div className="subscribe-wrapper">
        <div className="info">
          {/* Info left panel already above header and paragraph, so can omit */}
          <h3>Subscribe Now</h3>
        </div>
        <div className="form-panel" aria-label="Subscription form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="subscribe-email">Email Address</label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="subscribe-phone">Phone Number</label>
            <input
              id="subscribe-phone"
              type="tel"
              placeholder="+91 98765 43210"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label className="checkbox">
              <input
                type="checkbox"
                id="subscribe-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />{" "}
              I agree to receive all emails and updates.
            </label>
            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
