import { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
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
import JobsBoardSection from "./components/JobsBoardSection";
import NetworkHubSection from "./components/NetworkHubSection";
import ToastStack from "./components/ToastStack";

const defaultCoords = { lat: -1.286389, lng: 36.817223 };
const inferredApiBaseUrl = "https://servicemart.alwaysdata.net";
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || inferredApiBaseUrl).replace(/\/$/, "");
const authTokenStorageKey = "service-mart-auth-token";
const authUserStorageKey = "service-mart-auth-user";

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
    footerInstagram: "Instagram: @nyalia.ke",
    footerPhone: "Mobile: 0791019946"
  },
  es: {
    navMarketplace: "Mercado",
    navBookings: "Reservas",
    navCareers: "Empleos",
    navEmployer: "Pagina del empleador",
    navSubtitle: "Mercado global de servicios y contratacion",
    heroEyebrow: "Mercado global de servicios",
    heroSubtitle:
      "Una plataforma global premium que conecta clientes, trabajadores, empleadores, contrataciones rapidas, resenas verificadas y oportunidades internacionales.",
    footerDeveloper: "Desarrollado en Nairobi, Kenia por Marvin Ochieng",
    footerInstagram: "Instagram: @nyalia.ke",
    footerPhone: "Mobile: 0791019946"
  },
  fr: {
    navMarketplace: "Marketplace",
    navBookings: "Reservations",
    navCareers: "Carrieres",
    navEmployer: "Page employeur",
    navSubtitle: "Place de marche mondiale pour services et recrutement",
    heroEyebrow: "Place de marche mondiale",
    heroSubtitle:
      "Une plateforme premium mondiale reliant clients, travailleurs, employeurs, recrutements rapides, avis verifies et opportunites internationales.",
    footerDeveloper: "Developpe a Nairobi, Kenya par Marvin Ochieng",
    footerInstagram: "Instagram : @nyalia.ke",
    footerPhone: "Mobile: 0791019946"
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
    footerInstagram: "Instagram: @nyalia.ke",
    footerPhone: "Mobile: 0791019946"
  }
};

function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

function HomePage({ careers, employerUrl, labels, providerCount, renderServiceName }) {
  return (
    <>
      <HeroSection
        careersCount={careers.length}
        employerUrl={employerUrl}
        providerCount={providerCount}
        labels={labels}
      />
      <MarketStrip renderServiceName={renderServiceName} />
      <section className="panel route-panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Explore by page</p>
            <h2>Everything now has a dedicated page</h2>
          </div>
        </div>
        <div className="route-nav-grid">
          <Link to="/auth" className="button primary">Account access</Link>
          <Link to="/marketplace" className="button secondary">Marketplace search</Link>
          <Link to="/providers" className="button ghost">Provider details</Link>
          <Link to="/jobs" className="button secondary">Jobs board</Link>
          <Link to="/network" className="button ghost">Network hub</Link>
          <Link to="/careers" className="button ghost">Careers hub</Link>
        </div>
      </section>
    </>
  );
}

function ProvidersRoute({
  bookingForm,
  onBookingChange,
  onBookingSubmit,
  onEnsureProviderLoaded,
  onReviewChange,
  onReviewSubmit,
  provider,
  reviewForm,
  services
}) {
  const { providerId } = useParams();

  useEffect(() => {
    if (providerId) {
      const numericId = Number(providerId);
      if (Number.isInteger(numericId) && numericId > 0) {
        onEnsureProviderLoaded(numericId);
      }
      return;
    }

    if (!provider && services.length > 0) {
      onEnsureProviderLoaded(services[0].id);
    }
  }, [onEnsureProviderLoaded, provider, providerId, services]);

  return (
    <ProviderDetailSection
      bookingForm={bookingForm}
      onBookingChange={onBookingChange}
      onBookingSubmit={onBookingSubmit}
      onReviewChange={onReviewChange}
      onReviewSubmit={onReviewSubmit}
      provider={provider}
      reviewForm={reviewForm}
    />
  );
}

function AppShell() {
  const navigate = useNavigate();
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
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem(authUserStorageKey);
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      return null;
    }
  });

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

  useEffect(() => {
    restoreAuthSession();
  }, []);

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

  function persistSession(token, user) {
    localStorage.setItem(authTokenStorageKey, token);
    localStorage.setItem(authUserStorageKey, JSON.stringify(user));
    setCurrentUser(user);
  }

  function clearSession() {
    localStorage.removeItem(authTokenStorageKey);
    localStorage.removeItem(authUserStorageKey);
    setCurrentUser(null);
  }

  async function restoreAuthSession() {
    const token = localStorage.getItem(authTokenStorageKey);
    if (!token) {
      return;
    }

    try {
      const response = await fetch(apiUrl("/api/auth/me"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        clearSession();
        return;
      }

      const payload = await response.json();
      if (payload.user) {
        persistSession(token, payload.user);
      }
    } catch (error) {
      clearSession();
    }
  }

  async function loadMeta() {
    try {
      const response = await fetch(apiUrl("/api/meta"));
      if (!response.ok) {
        throw new Error("Meta request failed");
      }
      const payload = await response.json();
      setMeta(payload);
    } catch (error) {
      setMeta(null);
    }
  }

  async function loadCareers() {
    try {
      const response = await fetch(apiUrl("/api/careers"));
      if (!response.ok) {
        throw new Error("Careers request failed");
      }
      const payload = await response.json();
      setCareers(payload.roles || []);
    } catch (error) {
      setCareers([]);
    }
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

    try {
      const response = await fetch(apiUrl(`/api/services?${params.toString()}`));
      if (!response.ok) {
        throw new Error("Services request failed");
      }
      const payload = await response.json();
      setServices(payload);

      if (payload.length > 0) {
        const selectedId =
          selectedProvider && payload.find((item) => item.id === selectedProvider.id)
            ? selectedProvider.id
            : payload[0].id;
        await loadProvider(selectedId);
      } else {
        setSelectedProvider(null);
      }
    } catch (error) {
      setServices([]);
      setSelectedProvider(null);
    }
  }

  async function loadProvider(providerId) {
    const response = await fetch(apiUrl(`/api/providers/${providerId}`));
    if (!response.ok) {
      throw new Error("Provider request failed");
    }

    const payload = await response.json();
    setSelectedProvider(payload);
    setBookingForm((current) => ({ ...current, provider_id: providerId }));
    setReviewForm((current) => ({ ...current, provider_id: providerId }));
  }

  async function ensureProviderLoaded(providerId) {
    if (selectedProvider?.id === providerId) {
      return;
    }

    try {
      await loadProvider(providerId);
    } catch (error) {
      pushToast("Provider unavailable", "The selected provider could not be loaded.", "error");
    }
  }

  async function selectProviderAndNavigate(providerId) {
    await ensureProviderLoaded(providerId);
    navigate(`/providers/${providerId}`);
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
    await ensureProviderLoaded(reviewForm.provider_id);
    await loadServices(coords);
  }

  async function postAuth(path, payload) {
    let responseData = {};
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    try {
      responseData = await response.json();
    } catch (error) {
      responseData = {};
    }

    if (!response.ok) {
      pushToast("Authentication failed", responseData.error || "Authentication failed.", "error");
      return false;
    }

    if (responseData.token && responseData.user) {
      persistSession(responseData.token, responseData.user);
    }
    pushToast("Success", responseData.message || "Authentication successful.", "success");
    return true;
  }

  async function handleSignup(formPayload) {
    const success = await postAuth("/api/auth/signup", formPayload);
    if (success) {
      navigate("/marketplace");
    }
    return success;
  }

  async function handleLogin(formPayload) {
    const success = await postAuth("/api/auth/login", formPayload);
    if (success) {
      navigate("/marketplace");
    }
    return success;
  }

  const categories = [...new Set(services.map((service) => service.service_type))];
  const topRated = [...services].sort((a, b) => b.average_rating - a.average_rating).slice(0, 3);
  const labels = languageCopy[language] || languageCopy.en;

  return (
    <div className="page-shell">
      <Navbar
        currentUser={currentUser}
        employerUrl={meta?.employer_url}
        labels={labels}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
      />

      <TranslatorPanel language={language} />

      <main className="content-grid page-main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                careers={careers}
                employerUrl={meta?.employer_url}
                labels={labels}
                providerCount={services.length}
                renderServiceName={meta?.render?.service_name}
              />
            }
          />
          <Route
            path="/auth"
            element={
              <AuthSection
                currentUser={currentUser}
                labels={labels}
                onLogin={handleLogin}
                onSignup={handleSignup}
              />
            }
          />
          <Route
            path="/marketplace"
            element={
              <MarketplaceSection
                categories={categories}
                category={category}
                onCategoryChange={setCategory}
                onProviderSelect={selectProviderAndNavigate}
                onSearch={handleSearch}
                onUseLocation={useBrowserLocation}
                search={search}
                selectedProviderId={selectedProvider?.id}
                services={services}
                setSearch={setSearch}
                topRated={topRated}
              />
            }
          />
          <Route
            path="/providers"
            element={
              <ProvidersRoute
                bookingForm={bookingForm}
                onBookingChange={setBookingForm}
                onBookingSubmit={submitBooking}
                onEnsureProviderLoaded={ensureProviderLoaded}
                onReviewChange={setReviewForm}
                onReviewSubmit={submitReview}
                provider={selectedProvider}
                reviewForm={reviewForm}
                services={services}
              />
            }
          />
          <Route
            path="/providers/:providerId"
            element={
              <ProvidersRoute
                bookingForm={bookingForm}
                onBookingChange={setBookingForm}
                onBookingSubmit={submitBooking}
                onEnsureProviderLoaded={ensureProviderLoaded}
                onReviewChange={setReviewForm}
                onReviewSubmit={submitReview}
                provider={selectedProvider}
                reviewForm={reviewForm}
                services={services}
              />
            }
          />
          <Route
            path="/careers"
            element={<CareersSection careers={careers} employerUrl={meta?.employer_url} />}
          />
          <Route
            path="/jobs"
            element={<JobsBoardSection employerUrl={meta?.employer_url} jobs={jobs.length > 0 ? jobs : careers} />}
          />
          <Route
            path="/network"
            element={<NetworkHubSection currentUser={currentUser} jobs={jobs.length > 0 ? jobs : careers} services={services} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
