import { useState } from "react";

function CareersSection({ careers, employerUrl }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const careersHref = employerUrl || "/careers";

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCareers = careers.filter((career) => {
    const text = `${career.title} ${career.team} ${career.location} ${career.type} ${career.description}`.toLowerCase();
    const queryMatches = !normalizedQuery || text.includes(normalizedQuery);
    const typeMatches = typeFilter === "all" || career.type.toLowerCase().includes(typeFilter);
    return queryMatches && typeMatches;
  });

  const featuredCareer = filteredCareers[0];
  const supportingCareers = filteredCareers.slice(1);

  return (
    <section className="panel careers-panel" id="careers">
      <div className="careers-hero">
        <div className="careers-copy">
          <p className="eyebrow">Employer Studio</p>
          <h2>Join the team behind a premium local services brand.</h2>
          <p className="careers-intro">
            Service Mart is not just a marketplace. It is the operating layer behind
            trusted home services, provider growth, and a customer experience built to feel refined.
          </p>
          <div className="careers-pill-row">
            <span>Operations excellence</span>
            <span>Field growth</span>
            <span>Product craftsmanship</span>
          </div>
        </div>
        <div className="careers-summary-card">
          <p className="eyebrow">Why people join</p>
          <ul className="careers-benefits">
            <li>High-ownership roles with visible market impact</li>
            <li>Cross-functional collaboration between ops, support, and product</li>
            <li>Career paths built around service quality and growth</li>
          </ul>
          <a
            href={careersHref}
            target={employerUrl ? "_blank" : undefined}
            rel={employerUrl ? "noreferrer" : undefined}
            className="button secondary"
          >
            Visit employer page
          </a>
        </div>
      </div>

      {featuredCareer ? (
        <div className="featured-career">
          <div className="featured-career-copy">
            <p className="eyebrow">Featured opportunity</p>
            <h3>{featuredCareer.title}</h3>
            <p className="career-meta">
              {featuredCareer.team} - {featuredCareer.location} - {featuredCareer.type}
            </p>
            <p>{featuredCareer.description}</p>
          </div>
          <a
            href={featuredCareer.apply_url}
            target="_blank"
            rel="noreferrer"
            className="button primary"
          >
            Apply for featured role
          </a>
        </div>
      ) : null}

      <div className="section-head careers-section-head">
        <div>
          <p className="eyebrow">Open roles</p>
          <h3>Current employer openings</h3>
        </div>
      </div>

      <div className="careers-filter-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, team, location..."
        />
        <div className="careers-filter-chips">
          <button type="button" className={`stats-chip ${typeFilter === "all" ? "active" : ""}`} onClick={() => setTypeFilter("all")}>
            All
          </button>
          <button type="button" className={`stats-chip ${typeFilter === "full" ? "active" : ""}`} onClick={() => setTypeFilter("full")}>
            Full-time
          </button>
          <button type="button" className={`stats-chip ${typeFilter === "contract" ? "active" : ""}`} onClick={() => setTypeFilter("contract")}>
            Contract
          </button>
          <button type="button" className={`stats-chip ${typeFilter === "remote" ? "active" : ""}`} onClick={() => setTypeFilter("remote")}>
            Remote
          </button>
        </div>
      </div>

      <div className="career-list">
        {supportingCareers.length > 0 ? supportingCareers.map((career) => (
          <article key={career.id} className="career-card">
            <p className="career-meta">{career.team} - {career.location} - {career.type}</p>
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <a href={career.apply_url} target="_blank" rel="noreferrer">Apply now</a>
          </article>
        )) : filteredCareers.map((career) => (
          <article key={career.id} className="career-card">
            <p className="career-meta">{career.team} - {career.location} - {career.type}</p>
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <a href={career.apply_url} target="_blank" rel="noreferrer">Apply now</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CareersSection;
