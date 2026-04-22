import { Link, NavLink } from "react-router-dom";

function Navbar({ currentUser, employerUrl, labels, language, setLanguage, theme, toggleTheme }) {
  const careersHref = employerUrl || "/careers";
  const isExternalCareers = Boolean(employerUrl);

  return (
    <nav className="top-nav">
      <Link to="/" className="brand-lockup">
        <span className="brand-mark">SM</span>
        <span className="brand-text">
          <strong>Service Mart</strong>
          <small>{labels.navSubtitle}</small>
        </span>
      </Link>

      <div className="nav-center">
        <div className="nav-links">
          <NavLink to="/marketplace">{labels.navMarketplace}</NavLink>
          <NavLink to="/providers">{labels.navBookings}</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/network">Network</NavLink>
          <NavLink to="/careers">{labels.navCareers}</NavLink>
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
          {currentUser ? (
            <span className="nav-session">Hi, {currentUser.full_name}</span>
          ) : (
            <>
              <Link to="/auth" className="nav-text-link">
                {labels.navLogin || "Log in"}
              </Link>

              <Link to="/auth" className="button primary nav-mini-cta">
                {labels.navSignup || "Join free"}
              </Link>
            </>
          )}

          <a
            href={careersHref}
            className="button ghost nav-cta"
            target={isExternalCareers ? "_blank" : undefined}
            rel={isExternalCareers ? "noreferrer" : undefined}
          >
            {labels.navEmployer}
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
