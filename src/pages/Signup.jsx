// Signup: client account creation screen that keeps the original sign-up flow separate from the admin flow.
import { useState } from "react";
import { EyeIcon } from "./Login";
import { signup } from "../services/authService";

function Signup({ onLogin, onAccountCreated }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await signup({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });
      onAccountCreated();
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page signup-page" aria-labelledby="signup-title">
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

      <section className="login-card signup-card">
        <div className="login-intro">
          <p className="login-eyebrow">Your personal library</p>
          <h1 id="signup-title">Create your account</h1>
          <p>Join your personal photo library.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="full-name">Full Name</label>
            <input
              id="full-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="signup-password">Password</label>
            <div className="login-password-wrap">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                required
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
          </div>

          <div className="login-field">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="login-password-wrap">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
              >
                <EyeIcon hidden={!showConfirmPassword} />
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="login-signup">
          Already have an account?{" "}
          <button type="button" onClick={onLogin}>
            Log in
          </button>
        </p>
      </section>
    </main>
  );
}

export default Signup;
