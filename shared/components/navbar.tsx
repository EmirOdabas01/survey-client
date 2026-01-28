"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Public Surveys", public: true },
    { href: "/surveys/private", label: "Private Surveys", public: false },
    { href: "/surveys/groups", label: "Group Surveys", public: false },
  ];

  function isActive(href: string) {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        boxShadow:
          "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link
              href="/"
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#2563eb",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              >
                <path
                  d="M9 12l2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.46 0 2.84.35 4.05.97"
                  strokeLinecap="round"
                />
              </svg>
              SurveyApp
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              className="desktop-nav"
            >
              {navLinks.map((link) => {
                if (!link.public && !isAuthenticated) return null;

                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      backgroundColor: active ? "#eff6ff" : "transparent",
                      color: active ? "#2563eb" : "#475569",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "#f1f5f9";
                        e.currentTarget.style.color = "#1e293b";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#475569";
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: pathname.startsWith("/dashboard")
                      ? "#eff6ff"
                      : "transparent",
                    color: pathname.startsWith("/dashboard")
                      ? "#2563eb"
                      : "#475569",
                  }}
                  onMouseEnter={(e) => {
                    if (!pathname.startsWith("/dashboard")) {
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                      e.currentTarget.style.color = "#1e293b";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!pathname.startsWith("/dashboard")) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  Dashboard
                </Link>

                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#e2e8f0",
                    margin: "0 4px",
                  }}
                />

                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {(
                        user?.userInfo.userName ||
                        user?.userInfo.nameSurname ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#334155",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user?.userInfo.userName || user?.userInfo.nameSurname}
                    </span>
                  </div>

                  <button
                    onClick={logout}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#dc2626",
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fee2e2";
                      e.currentTarget.style.borderColor = "#fca5a5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef2f2";
                      e.currentTarget.style.borderColor = "#fecaca";
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#475569",
                    textDecoration: "none",
                    borderRadius: "8px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                    e.currentTarget.style.color = "#1e293b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#ffffff",
                    backgroundColor: "#2563eb",
                    textDecoration: "none",
                    borderRadius: "8px",
                    transition: "all 0.15s ease",
                    boxShadow: "0 1px 2px rgba(37, 99, 235, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(37, 99, 235, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 2px rgba(37, 99, 235, 0.2)";
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
