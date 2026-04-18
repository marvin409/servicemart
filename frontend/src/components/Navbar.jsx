function Navbar({ employerUrl, labels, language, setLanguage, theme, toggleTheme }) {
  const careersHref = employerUrl || "#careers";

  return (
    <nav className="top-nav">
      <a href="#top" className="brand-lockup">
        <span className="brand-mark">SM</span>
        <span className="brand-text">
          <strong>Service Mart</strong>
          <small>{labels.navSubtitle}</small>
        </span>
      </a>

      <div className="nav-center">
        <div className="nav-links">
          <a href="#discover">{labels.navMarketplace}</a>
          <a href="#provider">{labels.navBookings}</a>
          <a href="#careers">{labels.navCareers}</a>
        </div>
      </div>

      <div className="nav-tools">
        <div className="nav-utility">
          <label className="language-switcher" title="Change language">
            <span className="tool-icon">Lang</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="sw">SW</option>
            </select>
          </label>

          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>

        <div className="nav-actions">
          <a href="#auth" className="nav-text-link">
            {labels.navLogin || "Log in"}
          </a>

          <a href="#auth" className="button primary nav-mini-cta">
            {labels.navSignup || "Join free"}
          </a>

          <a
            href={careersHref}
            className="button ghost nav-cta"
            target={employerUrl ? "_blank" : undefined}
            rel={employerUrl ? "noreferrer" : undefined}
          >
            {labels.navEmployer}
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
