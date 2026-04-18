function CareersSection({ careers, employerUrl }) {
  const featuredCareer = careers[0];
  const supportingCareers = careers.slice(1);
  const careersHref = employerUrl || "#careers";

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

      <div className="career-list">
        {supportingCareers.length > 0 ? supportingCareers.map((career) => (
          <article key={career.id} className="career-card">
            <p className="career-meta">{career.team} - {career.location} - {career.type}</p>
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <a href={career.apply_url} target="_blank" rel="noreferrer">Apply now</a>
          </article>
        )) : careers.map((career) => (
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
