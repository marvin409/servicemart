function AuthSection({ labels }) {
  return (
    <section className="panel auth-panel" id="auth">
      <div className="section-head">
        <div>
          <p className="eyebrow">Account Access</p>
          <h2>Login or create your Service Mart account</h2>
        </div>
      </div>

      <div className="auth-grid">
        <form className="form-card">
          <p className="eyebrow">{labels.navLogin || "Login"}</p>
          <h3>Access your dashboard</h3>
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />
          <button type="button" className="button ghost">{labels.navLogin || "Login"}</button>
        </form>

        <form className="form-card accent-card">
          <p className="eyebrow">{labels.navSignup || "Sign up"}</p>
          <h3>Create a new account</h3>
          <input type="text" placeholder="Full name" />
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Create password" />
          <button type="button" className="button primary">{labels.navSignup || "Sign up"}</button>
        </form>
      </div>
    </section>
  );
}

export default AuthSection;
