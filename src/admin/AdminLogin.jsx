import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Lock, 
  ArrowLeft, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  LogIn 
} from "lucide-react";

export const AdminLogin = () => {
  const { loginWithSupabase, setCurrentView, settings } = useApp();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    let cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // If user provided a username without '@', resolve to domain email (e.g. admin -> admin@erphanam.com)
      if (!cleanUsername.includes("@")) {
        cleanUsername = `${cleanUsername.toLowerCase()}@erphanam.com`;
      }

      // Authenticate exclusively via Supabase Auth with encrypted credentials
      const result = await loginWithSupabase(cleanUsername, password);
      if (result.success) {
        setCurrentView("admin");
      } else {
        setErrorMessage(
          result.error || "Invalid administrator credentials. Please check your Supabase registered email and password."
        );
      }
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-top-bar">
          <button
            className="admin-back-btn"
            onClick={() => setCurrentView("client")}
            title="Return to Public Website"
          >
            <ArrowLeft size={15} /> <span>Back to Public Website</span>
          </button>
        </div>

        <div className="admin-login-header">
          <div className="admin-login-logo-box">
            <img 
              src="/Client logos/User Logo/eap-logo.png" 
              alt="Erphan Alam Enterprises" 
              className="admin-login-emblem"
            />
          </div>
          <h2>Executive Admin Portal</h2>
          <p>{settings.companyName} • Management Console</p>
        </div>

        {errorMessage && (
          <div className="admin-login-error">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          {/* Username / Email Field */}
          <div className="form-group mb-3">
            <label className="admin-field-label">Username or Email</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                placeholder="Enter email or username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage("");
                }}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group mb-4">
            <label className="admin-field-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="admin-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={18} /> <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
