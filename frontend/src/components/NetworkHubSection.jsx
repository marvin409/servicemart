import { Link } from "react-router-dom";

function NetworkHubSection({ currentUser, jobs, services }) {
  const profileLabel = currentUser ? `${currentUser.full_name} (${currentUser.email})` : "Guest profile";
  const suggestedJobs = jobs.slice(0, 3);
  const nearbyServices = services.slice(0, 3);

  return (
    <section className="panel route-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Network Page</p>
          <h2>Professional activity and opportunities</h2>
        </div>
      </div>

      <div className="network-grid">
        <article className="form-card">
          <p className="eyebrow">Profile snapshot</p>
          <h3>{profileLabel}</h3>
          <p className="auth-session-meta">
            Build a stronger profile by keeping account details current and applying consistently to matching roles.
          </p>
          <Link to="/auth" className="button ghost">Update account</Link>
        </article>

        <article className="form-card accent-card">
          <p className="eyebrow">Suggested jobs</p>
          <h3>High-match opportunities</h3>
          <div className="network-list">
            {suggestedJobs.map((job) => (
              <a key={job.id} href={job.apply_url} target="_blank" rel="noreferrer">{job.title}</a>
            ))}
          </div>
          <Link to="/jobs" className="button primary">Open jobs page</Link>
        </article>

        <article className="form-card">
          <p className="eyebrow">Service demand</p>
          <h3>Provider opportunities nearby</h3>
          <div className="network-list">
            {nearbyServices.map((service) => (
              <span key={service.id}>{service.service_type} - {service.neighborhood}</span>
            ))}
          </div>
          <Link to="/marketplace" className="button secondary">Browse marketplace</Link>
        </article>
      </div>
    </section>
  );
}

export default NetworkHubSection;
