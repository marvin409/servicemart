import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import MarketStrip from "./components/MarketStrip";
import MarketplaceSection from "./components/MarketplaceSection";
import ProviderDetailSection from "./components/ProviderDetailSection";
import CareersSection from "./components/CareersSection";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TranslatorPanel from "./components/TranslatorPanel";
import JobsChatbot from "./components/JobsChatbot";
import AuthSection from "./components/AuthSection";
import ToastStack from "./components/ToastStack";

const defaultCoords = { lat: -1.286389, lng: 36.817223 };
const inferredApiBaseUrl = "https://servicemart.alwaysdata.net";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || inferredApiBaseUrl).replace(/\/$/, "");

const languageCopy = {
  en: {
    navMarketplace: "Find talent",
    navBookings: "Book services",
    navCareers: "Work opportunities",
    navLogin: "Log in",
    navSignup: "Join free",
    navEmployer: "For employers",
    navSubtitle: "Global hiring and services, built in Nairobi",
    heroEyebrow: "Work and services without borders",
    heroSubtitle:
      "Service Mart helps clients hire faster, helps workers get discovered, and makes cross-border service work feel simple and trustworthy.",
    footerDeveloper: "Developed in Nairobi, Kenya by Marvin Ochieng",
    footerInstagram: "Instagram: @nai.raw.b3rry"
  },
  es: {
    navMarketplace: "Mercado",
    navBookings: "Reservas",
    navCareers: "Empleos",
    navEmployer: "Página del empleador",
    navSubtitle: "Mercado global de servicios y contratación",
    heroEyebrow: "Mercado global de servicios",
    heroSubtitle:
      "Una plataforma global premium que conecta clientes, trabajadores, empleadores, contrataciones rápidas, reseñas verificadas y oportunidades internacionales.",
    footerDeveloper: "Desarrollado en Nairobi, Kenia por Marvin Ochieng",
    footerInstagram: "Instagram: @nai.raw.b3rry"
  },
  fr: {
    navMarketplace: "Marketplace",
    navBookings: "Réservations",
    navCareers: "Carrières",
    navEmployer: "Page employeur",
    navSubtitle: "Place de marché mondiale pour services et recrutement",
    heroEyebrow: "Place de marché mondiale",
    heroSubtitle:
      "Une plateforme premium mondiale reliant clients, travailleurs, employeurs, recrutements rapides, avis vérifiés et opportunités internationales.",
    footerDeveloper: "Développé à Nairobi, Kenya par Marvin Ochieng",
    footerInstagram: "Instagram : @nai.raw.b3rry"
  },
  sw: {
    navMarketplace: "Soko",
    navBookings: "Uhifadhi",
    navCareers: "Ajira",
    navEmployer: "Ukurasa wa mwajiri",
    navSubtitle: "Soko la kimataifa la huduma na ajira",
    heroEyebrow: "Soko la huduma la kimataifa",
    heroSubtitle:
      "Jukwaa la hadhi ya juu linalounganisha wateja, wafanyakazi, waajiri, ajira za haraka, hakiki zilizothibitishwa na fursa za kimataifa.",
    footerDeveloper: "Imeundwa Nairobi, Kenya na Marvin Ochieng",
    footerInstagram: "Instagram: @nai.raw.b3rry"
  }
};

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

function App() {
  const [meta, setMeta] = useState(null);
  const [services, setServices] = useState([]);
  const [careers, setCareers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [coords, setCoords] = useState(defaultCoords);
  const [toasts, setToasts] = useState([]);
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
  const [theme, setTheme] = useState(() => localStorage.getItem("service-mart-theme") || "light");
  const [language, setLanguage] = useState(() => localStorage.getItem("service-mart-language") || "en");

  useEffect(() => {
    loadMeta();
    loadServices(defaultCoords);
    loadCareers();
    loadJobs();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("service-mart-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("service-mart-language", language);
  }, [language]);

  function pushToast(title, message, type = "info") {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, title, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

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

  async function loadJobs() {
    try {
      const response = await fetch(apiUrl("/api/jobs"));
      if (!response.ok) {
        throw new Error("Jobs request failed");
      }
      const payload = await response.json();
      setJobs(payload || []);
    } catch (error) {
      setJobs([]);
    }
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
      pushToast("Location unavailable", "Geolocation is not available in this browser.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: browserCoords }) => {
        const nextCoords = {
          lat: Number(browserCoords.latitude.toFixed(6)),
          lng: Number(browserCoords.longitude.toFixed(6))
        };
        setCoords(nextCoords);
        pushToast("Location updated", "Search results now use your live location.", "success");
        await loadServices(nextCoords);
      },
      () => pushToast("Location denied", "Using Nairobi as the default search area.", "error")
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
      pushToast("Booking failed", payload.error || "Booking request failed.", "error");
      return;
    }

    pushToast("Booking sent", `Booking request sent to ${payload.provider_name}.`, "success");
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
      pushToast("Review failed", payload.error || "Review submission failed.", "error");
      return;
    }

    pushToast("Review posted", "Your review was posted successfully.", "success");
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
  const labels = languageCopy[language] || languageCopy.en;

  return (
    <div className="page-shell">
      <Navbar
        employerUrl={meta?.employer_url}
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
      />

      <TranslatorPanel language={language} />

      <HeroSection
        careersCount={careers.length}
        employerUrl={meta?.employer_url}
        providerCount={services.length}
        labels={labels}
      />

      <MarketStrip renderServiceName={meta?.render?.service_name} />

      <main className="content-grid">
        <AuthSection labels={labels} />

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

      <Footer labels={labels} />
      <JobsChatbot
        careers={jobs.length > 0 ? jobs : careers}
        employerUrl={meta?.employer_url}
        premiumFee={`${meta?.premium_match?.currency || "USD"} ${meta?.premium_match?.fee || 29}`}
      />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
