import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const { login, resetPassword, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setResetMessage("");

    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || "Failed to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setLocalError("");
    setResetMessage("");

    if (!email) {
      setLocalError("Please enter your admin email above first, then click 'Forgot password?'.");
      return;
    }

    try {
      await resetPassword(email);
      setResetMessage(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err) {
      setLocalError(err.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="login-page container section fade-in">
      <motion.div 
        className="login-card glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="login-icon-wrap">
            <ShieldCheck size={32} />
          </div>
          <h2 className="gradient-text">Admin Portal</h2>
          <p>Sign in with your administrator account to access the dashboard</p>
        </div>

        {localError && (
          <div className="login-alert login-alert-error">
            <AlertCircle size={18} className="login-alert-icon" />
            <span>{localError}</span>
          </div>
        )}

        {resetMessage && (
          <div className="login-alert login-alert-success">
            <CheckCircle2 size={18} className="login-alert-icon" />
            <span>{resetMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-footer-actions">
            <button
              type="button"
              className="btn-forgot"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-login"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Secure Sign In</span>
              </>
            )}
          </button>
        </form>

        <Link to="/" className="login-back-home">
          <ArrowLeft size={16} />
          <span>Return to Portfolio</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Login;
