import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/AuthModal.css";

const AuthModal = ({ onAuthSuccess }) => {
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.email || (!isForgotPassword && !form.password) || (isSignup && !form.name)) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { data } = await axios.post("http://localhost:5000/api/auth/forgot-password", {
          email: form.email,
        });
        setSuccessMessage(data.message);
      } else {
        const url = isSignup
          ? "http://localhost:5000/api/auth/signup"
          : "http://localhost:5000/api/auth/login";

        const { data } = await axios.post(url, form);
        login(data.user, data.token);
        onAuthSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSuccessMessage("");
  };

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
    setIsForgotPassword(false);
    resetForm();
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignup(false);
    resetForm();
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setIsSignup(false);
    resetForm();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h2>{isForgotPassword ? "Forgot Password" : isSignup ? "Sign Up" : "Log In"}</h2>

        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && !isForgotPassword && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {!isForgotPassword && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
          )}
          <button type="submit" disabled={loading}>
            {loading
              ? "Processing..."
              : isForgotPassword
              ? "Send Reset Link"
              : isSignup
              ? "Sign Up"
              : "Log In"}
          </button>
        </form>

        
        {isForgotPassword ? (
          <p onClick={backToLogin} className="auth-switch">
            Back to Login
          </p>
        ) : (
          <p onClick={toggleForm} className="auth-switch">
            {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
          </p>
        )}

        {!isForgotPassword && (
          <p onClick={toggleForgotPassword} className="auth-forgot">
            Forgot password ?
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
