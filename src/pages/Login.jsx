// Login: client authentication screen for returning users, with validation, password toggle, and client-login flow.
import { useEffect, useRef, useState } from "react";
import { login } from "../services/authService";

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3.3 4.7 16 16 1.4-1.4-16-16-1.4 1.4ZM12 7c3.4 0 6.3 2 7.8 5-0.5 1-1.2 1.9-2.1 2.6l1.4 1.4C20.3 14.7 21 13.4 21.5 12 19.9 7.9 16.2 5 12 5c-1.1 0-2.2.2-3.2.6l1.6 1.6c.5-.1 1-.2 1.6-.2Zm0 10c-3.4 0-6.3-2-7.8-5 .5-1 1.2-1.9 2.1-2.6L4.9 8C3.7 9.3 3 10.6 2.5 12c1.6 4.1 5.3 7 9.5 7 1.1 0 2.2-.2 3.2-.6l-1.6-1.6c-.5.1-1 .2-1.6.2Zm0-2.5a2.5 2.5 0 0 1-2.5-2.5c0-.4.1-.8.3-1.1l3.3 3.3c-.3.2-.7.3-1.1.3Zm0-5a2.5 2.5 0 0 1 2.5 2.5c0 .4-.1.8-.3 1.1l-3.3-3.3c.3-.2.7-.3 1.1-.3Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c-4.2 0-7.9 2.9-9.5 7 1.6 4.1 5.3 7 9.5 7s7.9-2.9 9.5-7C19.9 7.9 16.2 5 12 5Zm0 11.5A4.5 4.5 0 1 1 12 7a4.5 4.5 0 0 1 0 9.5Zm0-2A2.5 2.5 0 1 0 12 9a2.5 2.5 0 0 0 0 5.5Z" />
    </svg>
  );
}

function Login({
  onLoginSuccess,
  onSignup,
  onAdminLogin,
  accountCreated,
  onAccountCreatedAlert,
  sessionError,
}) {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountCreatedAlertShown = useRef(false);
  const rememberMeAlertShown = useRef(false);

  useEffect(() => {
    if (sessionError) {
      setErrors((current) => ({ ...current, credentials: sessionError }));
    }
  }, [sessionError]);

  useEffect(() => {
    if (!accountCreated || accountCreatedAlertShown.current) return;

    accountCreatedAlertShown.current = true;
    window.alert("Account Created");
    onAccountCreatedAlert();
  }, [accountCreated, onAccountCreatedAlert]);

  function validate() {
    const nextErrors = {};

    if (!identity.trim()) {
      nextErrors.identity = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.trim())) {
      nextErrors.identity = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({
        email: identity.trim(),
        password,
      });
      onLoginSuccess(result.user);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        credentials: error.message,
      }));
      setIsSubmitting(false);
    }
  }

  function handleIdentityChange(event) {
    setIdentity(event.target.value);
    setErrors((current) => ({ ...current, identity: "", credentials: "" }));
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setErrors((current) => ({ ...current, password: "", credentials: "" }));
  }

  function handleRememberMeChange(event) {
    const checked = event.target.checked;
    setRememberMe(checked);

    if (checked && !rememberMeAlertShown.current) {
      rememberMeAlertShown.current = true;
      window.alert("The Remember Me feature will be available in the next update.");
    }
  }

  return (
    <main className="login-page" aria-labelledby="login-title">
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
        <button
          className="login-admin-link"
          type="button"
          onClick={onAdminLogin}
        >
          Admin Login
        </button>
      </header>

      <section className="login-card">
        <div className="login-intro">
          <p className="login-eyebrow">Your personal library</p>
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to your photo library.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="identity">Email</label>
            <input
              id="identity"
              name="identity"
              type="email"
              value={identity}
              onChange={handleIdentityChange}
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={Boolean(errors.identity)}
              aria-describedby={errors.identity ? "identity-error" : undefined}
            />
            {errors.identity && (
              <p className="login-error" id="identity-error">
                {errors.identity}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
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
              <p className="login-error" id="password-error">
                {errors.password}
              </p>
            )}
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span>Remember me</span>
            </label>
            <button
              className="login-link"
              type="button"
              onClick={() =>
                window.alert(
                  "The Forgot Password feature will be available in the next update.\nPlease try to remember your password 🫡",
                )
              }
            >
              Forgot password?
            </button>
          </div>

          {errors.credentials && (
            <p className="login-error login-credentials-error" role="alert">
              {errors.credentials}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="login-signup">
          New here? <button type="button" onClick={onSignup}>Create an account</button>
        </p>
      </section>
    </main>
  );
}

export { EyeIcon };
export default Login;
