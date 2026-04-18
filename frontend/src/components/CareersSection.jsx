function CareersSection({ careers, employerUrl }) {
  return (
    <section className="panel careers-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Careers Hub</p>
          <h2>Employer roles hosted inside Service Mart</h2>
        </div>
        <a
          href={employerUrl || "https://example.com/careers"}
          target="_blank"
          rel="noreferrer"
          className="button ghost"
        >
          Visit employer page
        </a>
      </div>
      <div className="career-list">
        {careers.map((career) => (
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
