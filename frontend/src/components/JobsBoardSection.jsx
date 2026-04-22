import { useMemo, useState } from "react";

function JobsBoardSection({ employerUrl, jobs }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const text = `${job.title} ${job.team} ${job.location} ${job.type} ${job.description}`.toLowerCase();
      const queryMatch = !normalizedQuery || text.includes(normalizedQuery);
      const modeMatch = mode === "all" || text.includes(mode);
      return queryMatch && modeMatch;
    });
  }, [jobs, mode, query]);

  return (
    <section className="panel careers-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Jobs Page</p>
          <h2>Track and apply to live openings</h2>
        </div>
        <a
          href={employerUrl || "/careers"}
          target={employerUrl ? "_blank" : undefined}
          rel={employerUrl ? "noreferrer" : undefined}
          className="button secondary"
        >
          Employer page
        </a>
      </div>

      <div className="careers-filter-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search role, team, or location..."
        />
        <div className="careers-filter-chips">
          <button type="button" className={`stats-chip ${mode === "all" ? "active" : ""}`} onClick={() => setMode("all")}>
            All
          </button>
          <button type="button" className={`stats-chip ${mode === "remote" ? "active" : ""}`} onClick={() => setMode("remote")}>
            Remote
          </button>
          <button type="button" className={`stats-chip ${mode === "full" ? "active" : ""}`} onClick={() => setMode("full")}>
            Full-time
          </button>
          <button type="button" className={`stats-chip ${mode === "contract" ? "active" : ""}`} onClick={() => setMode("contract")}>
            Contract
          </button>
        </div>
      </div>

      <div className="career-list">
        {filteredJobs.map((job) => (
          <article key={job.id} className="career-card">
            <p className="career-meta">{job.team} - {job.location} - {job.type}</p>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <a href={job.apply_url} target="_blank" rel="noreferrer">Apply now</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default JobsBoardSection;
