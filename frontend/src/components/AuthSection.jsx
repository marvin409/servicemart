import { useState } from "react";

function AuthSection({ currentUser, labels, onLogin, onSignup }) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ full_name: "", email: "", password: "" });
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  async function submitLogin(event) {
    event.preventDefault();
    if (!onLogin || loginSubmitting) {
      return;
    }

    setLoginSubmitting(true);
    try {
      const success = await onLogin(loginForm);
      if (success) {
        setLoginForm((current) => ({ ...current, password: "" }));
      }
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function submitSignup(event) {
    event.preventDefault();
    if (!onSignup || signupSubmitting) {
      return;
    }

    setSignupSubmitting(true);
    try {
      const success = await onSignup(signupForm);
      if (success) {
        setSignupForm((current) => ({ ...current, password: "" }));
      }
    } finally {
      setSignupSubmitting(false);
    }
  }

  return (
    <section className="panel auth-panel" id="auth">
      <div className="section-head">
        <div>
          <p className="eyebrow">Account Access</p>
          <h2>Login or create your Service Mart account</h2>
        </div>
      </div>

      {currentUser ? (
        <article className="form-card auth-session-card">
          <p className="eyebrow">Signed in</p>
          <h3>Welcome back, {currentUser.full_name}</h3>
          <p className="auth-session-meta">
            Logged in as {currentUser.email}
          </p>
        </article>
      ) : null}

      <div className="auth-grid">
        <form className="form-card" onSubmit={submitLogin}>
          <p className="eyebrow">{labels.navLogin || "Login"}</p>
          <h3>Access your dashboard</h3>
          <input
            type="email"
            placeholder="Email address"
            value={loginForm.email}
            onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
          <button type="submit" className="button ghost" disabled={loginSubmitting}>
            {loginSubmitting ? "Logging in..." : labels.navLogin || "Login"}
          </button>
        </form>

        <form className="form-card accent-card" onSubmit={submitSignup}>
          <p className="eyebrow">{labels.navSignup || "Sign up"}</p>
          <h3>Create a new account</h3>
          <input
            type="text"
            placeholder="Full name"
            value={signupForm.full_name}
            onChange={(event) => setSignupForm((current) => ({ ...current, full_name: event.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={signupForm.email}
            onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Create password"
            minLength={8}
            value={signupForm.password}
            onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
          <button type="submit" className="button primary" disabled={signupSubmitting}>
            {signupSubmitting ? "Creating..." : labels.navSignup || "Sign up"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthSection;
