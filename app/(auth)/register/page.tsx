"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nameSurname: "",
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);

      if (response.success) {
        setSuccess(
          response.message ||
            "Registration successful! Redirecting to login...",
        );
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "15px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#f0fdf4",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="#16a34a"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 8px 0",
              }}
            >
              Create account
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
              }}
            >
              Join us and start creating surveys
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                name="nameSurname"
                type="text"
                required
                value={formData.nameSurname}
                onChange={handleChange}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Username</label>
              <input
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleChange}
                placeholder="johndoe"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563eb";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.backgroundColor = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm</label>
                <input
                  name="passwordConfirm"
                  type="password"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563eb";
                    e.target.style.backgroundColor = "#ffffff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.backgroundColor = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 24px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: loading ? "#86efac" : "#16a34a",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(22, 163, 74, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#15803d";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(22, 163, 74, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#16a34a";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(22, 163, 74, 0.3)";
                }
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "28px 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}
            />
            <span
              style={{ padding: "0 16px", fontSize: "13px", color: "#94a3b8" }}
            >
              or
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#2563eb",
                fontWeight: 500,
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Sign in
            </Link>
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#94a3b8",
            marginTop: "24px",
          }}
        >
          By creating an account, you agree to our Terms of Service
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
