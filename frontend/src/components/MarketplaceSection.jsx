function MarketplaceSection({
  categories,
  category,
  onCategoryChange,
  onProviderSelect,
  onSearch,
  onUseLocation,
  search,
  selectedProviderId,
  services,
  setSearch,
  topRated
}) {
  return (
    <section className="panel" id="discover">
      <div className="section-head">
        <div>
          <p className="eyebrow">Marketplace Search</p>
          <h2>Find premium providers near you</h2>
        </div>
        <button type="button" className="button ghost" onClick={onUseLocation}>
          Use my location
        </button>
      </div>

      <form className="search-grid" onSubmit={onSearch}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search cleaners, plumbing, electrical repairs..."
        />
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All services</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button type="submit" className="button primary">Search</button>
      </form>

      <div className="top-rated-row">
        {topRated.map((provider) => (
          <div key={provider.id} className="mini-highlight">
            <span>{provider.service_type}</span>
            <strong>{provider.name}</strong>
            <small>{provider.average_rating} stars</small>
          </div>
        ))}
      </div>

      <div className="provider-list">
        {services.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`provider-card ${selectedProviderId === provider.id ? "active" : ""}`}
            onClick={() => onProviderSelect(provider.id)}
          >
            <div className="provider-main">
              <p className="provider-service">{provider.service_type}</p>
              <h3>{provider.name}</h3>
              <p>{provider.neighborhood}, {provider.city}</p>
            </div>
            <div className="provider-metrics">
              <span>KES {provider.hourly_rate.toFixed(2)}/hr</span>
              <span>{provider.average_rating} stars</span>
              <span>{provider.review_count} reviews</span>
              <span>
                {provider.distance_km !== null ? `${provider.distance_km} km away` : "Distance unavailable"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default MarketplaceSection;
