import { Link } from "react-router-dom";

function Stat({ value, label }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function HeroSection({ careersCount, employerUrl, providerCount, labels }) {
  const careersHref = employerUrl || "/careers";
  const isExternalCareers = Boolean(employerUrl);

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{labels.heroEyebrow}</p>
        <h1>Service Mart</h1>
        <p className="hero-subtitle">
          {labels.heroSubtitle}
        </p>
        <div className="hero-actions">
          <Link to="/marketplace" className="button primary">Discover services</Link>
          <a
            href={careersHref}
            className="button secondary"
            target={isExternalCareers ? "_blank" : undefined}
            rel={isExternalCareers ? "noreferrer" : undefined}
          >
            Employer careers
          </a>
        </div>
        <div className="hero-stats">
          <Stat value={`${providerCount}+`} label="active providers" />
          <Stat value="4.9/5" label="marketplace satisfaction" />
          <Stat value={`${careersCount}`} label="career openings" />
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-badge">Concierge quality</div>
        <h2>Built for trust, speed, and premium service discovery.</h2>
        <p>
          Customers can search by location, compare ratings, request bookings,
          and move from discovery to confirmation in a single flow.
        </p>
        <div className="feature-pills">
          <span>Nearby search</span>
          <span>Verified reviews</span>
          <span>Fast booking</span>
          <span>Careers hub</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
