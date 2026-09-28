// AdminLogin: dedicated admin sign-in page with placeholder demo auth and redirect to the admin panel.
import { useState } from "react";
import { EyeIcon } from "./Login";

const DEMO_ADMIN_USERNAME = "admin";
const DEMO_ADMIN_PASSWORD = "admin123";

function authenticateAdmin(usernameOrEmail, password) {
  // DEMO ONLY: replace this frontend check with backend authentication.
  return (
    usernameOrEmail.trim().toLowerCase() === DEMO_ADMIN_USERNAME &&
    password === DEMO_ADMIN_PASSWORD
  );
}

function AdminLogin({ onLoginSuccess, onBackToClientLogin }) {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!identity.trim()) {
      nextErrors.identity = "Please enter your username or email.";
    }
    if (!password) {
      nextErrors.password = "Please enter your password.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (authenticateAdmin(identity, password)) {
      onLoginSuccess();
      return;
    }

    setErrors({ credentials: "Invalid admin username or password." });
  }

  function handleIdentityChange(event) {
    setIdentity(event.target.value);
    setErrors((current) => ({
      ...current,
      identity: "",
      credentials: "",
    }));
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setErrors((current) => ({
      ...current,
      password: "",
      credentials: "",
    }));
  }

  return (
    <main className="login-page" aria-labelledby="admin-login-title">
      <div className="login-background" aria-hidden="true" />

      <header className="login-header">
        <div className="login-brand">
          <img
            className="login-brand-mark"
            src="/Icon-gallery.svg"
            alt=""
            aria-hidden="true"
          />
          <strong>Photo Gallery</strong>
        </div>
      </header>

      <section className="login-card">
        <div className="login-intro">
          <p className="login-eyebrow">Your personal library</p>
          <h1 id="admin-login-title">Admin Login</h1>
          <p>Sign in to the Photo Gallery administration panel.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="admin-identity">Username or Email</label>
            <input
              id="admin-identity"
              name="identity"
              type="text"
              value={identity}
              onChange={handleIdentityChange}
              placeholder="Enter your username or email"
              autoComplete="username"
              aria-invalid={Boolean(errors.identity)}
              aria-describedby={
                errors.identity ? "admin-identity-error" : undefined
              }
            />
            {errors.identity && (
              <p className="login-error" id="admin-identity-error">
                {errors.identity}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="admin-password">Password</label>
            <div className="login-password-wrap">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "admin-password-error" : undefined
                }
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                <EyeIcon hidden={!showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="login-error" id="admin-password-error">
                {errors.password}
              </p>
            )}
          </div>

          {errors.credentials && (
            <p className="login-error login-credentials-error" role="alert">
              {errors.credentials}
            </p>
          )}

          <button className="login-submit" type="submit">
            Login
          </button>
        </form>

        <p className="admin-login-footer">
          <button type="button" onClick={onBackToClientLogin}>
            Back to client login
          </button>
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
