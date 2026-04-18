import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import MarketStrip from "./components/MarketStrip";
import MarketplaceSection from "./components/MarketplaceSection";
import ProviderDetailSection from "./components/ProviderDetailSection";
import CareersSection from "./components/CareersSection";
import Footer from "./components/Footer";

const defaultCoords = { lat: -1.286389, lng: 36.817223 };
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

function App() {
  const [meta, setMeta] = useState(null);
  const [services, setServices] = useState([]);
  const [careers, setCareers] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [coords, setCoords] = useState(defaultCoords);
  const [message, setMessage] = useState("");
  const [bookingForm, setBookingForm] = useState({
    provider_id: "",
    customer_name: "",
    customer_email: "",
    booking_date: "",
    notes: ""
  });
  const [reviewForm, setReviewForm] = useState({
    provider_id: "",
    reviewer_name: "",
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    loadMeta();
    loadServices(defaultCoords);
    loadCareers();
  }, []);

  async function loadMeta() {
    const response = await fetch(apiUrl("/api/meta"));
    const payload = await response.json();
    setMeta(payload);
  }

  async function loadCareers() {
    const response = await fetch(apiUrl("/api/careers"));
    const payload = await response.json();
    setCareers(payload.roles || []);
  }

  async function loadServices(activeCoords = coords) {
    const params = new URLSearchParams();
    if (search) params.set("query", search);
    if (category) params.set("category", category);
    if (activeCoords?.lat && activeCoords?.lng) {
      params.set("lat", activeCoords.lat);
      params.set("lng", activeCoords.lng);
    }

    const response = await fetch(apiUrl(`/api/services?${params.toString()}`));
    const payload = await response.json();
    setServices(payload);

    if (payload.length > 0) {
      const featured =
        selectedProvider && payload.find((item) => item.id === selectedProvider.id)
          ? selectedProvider.id
          : payload[0].id;
      await loadProvider(featured);
    } else {
      setSelectedProvider(null);
    }
  }

  async function loadProvider(providerId) {
    const response = await fetch(apiUrl(`/api/providers/${providerId}`));
    const payload = await response.json();
    setSelectedProvider(payload);
    setBookingForm((current) => ({ ...current, provider_id: providerId }));
    setReviewForm((current) => ({ ...current, provider_id: providerId }));
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadServices(coords);
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: browserCoords }) => {
        const nextCoords = {
          lat: Number(browserCoords.latitude.toFixed(6)),
          lng: Number(browserCoords.longitude.toFixed(6))
        };
        setCoords(nextCoords);
        setMessage("Search updated with your live location.");
        await loadServices(nextCoords);
      },
      () => setMessage("Location access was denied. Using Nairobi as the search area.")
    );
  }

  async function submitBooking(event) {
    event.preventDefault();
    const response = await fetch(apiUrl("/api/bookings"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingForm)
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Booking request failed.");
      return;
    }

    setMessage(`Booking request sent to ${payload.provider_name}.`);
    setBookingForm((current) => ({
      ...current,
      customer_name: "",
      customer_email: "",
      booking_date: "",
      notes: ""
    }));
  }

  async function submitReview(event) {
    event.preventDefault();
    const response = await fetch(apiUrl(`/api/providers/${reviewForm.provider_id}/reviews`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewForm)
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "Review submission failed.");
      return;
    }

    setMessage("Review posted successfully.");
    setReviewForm((current) => ({
      ...current,
      reviewer_name: "",
      rating: 5,
      comment: ""
    }));
    await loadProvider(reviewForm.provider_id);
    await loadServices(coords);
  }

  const categories = [...new Set(services.map((service) => service.service_type))];
  const topRated = [...services].sort((a, b) => b.average_rating - a.average_rating).slice(0, 3);

  return (
    <div className="page-shell">
      <HeroSection
        careersCount={careers.length}
        employerUrl={meta?.employer_url}
        providerCount={services.length}
      />

      <MarketStrip renderServiceName={meta?.render?.service_name} />

      <main className="content-grid">
        <MarketplaceSection
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          onProviderSelect={loadProvider}
          onSearch={handleSearch}
          onUseLocation={useBrowserLocation}
          search={search}
          selectedProviderId={selectedProvider?.id}
          services={services}
          setSearch={setSearch}
          topRated={topRated}
        />

        <ProviderDetailSection
          bookingForm={bookingForm}
          onBookingChange={setBookingForm}
          onBookingSubmit={submitBooking}
          onReviewChange={setReviewForm}
          onReviewSubmit={submitReview}
          provider={selectedProvider}
          reviewForm={reviewForm}
        />

        <CareersSection careers={careers} employerUrl={meta?.employer_url} />
      </main>

      <Footer />

      {message ? <div className="toast">{message}</div> : null}
    </div>
  );
}

export default App;
