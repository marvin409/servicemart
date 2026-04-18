function MarketStrip({ renderServiceName }) {
  return (
    <section className="strip">
      <div>
        <p className="eyebrow">Trusted categories</p>
        <strong>Cleaners</strong>
        <strong>Plumbers</strong>
        <strong>Electricians</strong>
      </div>
      <div>
        <p className="eyebrow">Operating region</p>
        <strong>Nairobi coverage</strong>
      </div>
      <div>
        <p className="eyebrow">Deployment target</p>
        <strong>{renderServiceName || "Render backend"}</strong>
      </div>
    </section>
  );
}

export default MarketStrip;
