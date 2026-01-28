"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/auth-context";
import { SurveyList } from "@/features/surveys/components/survey-list";
import { GroupList } from "@/features/groups/components/group-list";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  function handleSurveyClick(surveyId: string) {
    router.push(`/s/${surveyId}`);
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            margin: 0,
            color: "#111827",
          }}
        >
          Welcome to Survey App
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          {user
            ? "Explore surveys and share your opinions"
            : "Login to access all features"}
        </p>
      </div>

      {user && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            onClick={() => router.push("/surveys/private")}
            style={{
              backgroundColor: "#f3e8ff",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              border: "1px solid #e9d5ff",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(139, 92, 246, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#a855f7",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#6b21a8",
                  }}
                >
                  Private Surveys
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#7c3aed",
                    margin: "4px 0 0 0",
                  }}
                >
                  Surveys shared directly with you
                </p>
              </div>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#a855f7"
                viewBox="0 0 24 24"
                style={{ marginLeft: "auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <div
            onClick={() => router.push("/surveys/groups")}
            style={{
              backgroundColor: "#ffedd5",
              borderRadius: "12px",
              padding: "20px",
              cursor: "pointer",
              border: "1px solid #fed7aa",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(249, 115, 22, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f97316",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#9a3412",
                  }}
                >
                  Group Surveys
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#ea580c",
                    margin: "4px 0 0 0",
                  }}
                >
                  Surveys from your groups
                </p>
              </div>
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#f97316"
                viewBox="0 0 24 24"
                style={{ marginLeft: "auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <section style={{ marginBottom: "48px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: 0,
              color: "#111827",
            }}
          >
            Public Surveys
          </h2>
          <span
            style={{
              padding: "4px 12px",
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Open to everyone
          </span>
        </div>
        <SurveyList type="public" onSurveyClick={handleSurveyClick} />
      </section>

      {user && (
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                margin: 0,
                color: "#111827",
              }}
            >
              Available Groups
            </h2>
            <button
              onClick={() => router.push("/dashboard/groups")}
              style={{
                padding: "6px 12px",
                backgroundColor: "transparent",
                color: "#2563eb",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid #2563eb",
                cursor: "pointer",
              }}
            >
              Manage My Groups
            </button>
          </div>
          <GroupList />
        </section>
      )}

      {!user && (
        <section style={{ marginTop: "48px" }}>
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "32px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#e0e7ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#4f46e5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: "0 0 8px 0",
                color: "#111827",
              }}
            >
              Want to see more?
            </h3>
            <p
              style={{
                color: "#6b7280",
                marginBottom: "20px",
                maxWidth: "400px",
                margin: "0 auto 20px",
              }}
            >
              Login to access private surveys, group surveys, join groups, and
              create your own surveys.
            </p>
            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                onClick={() => router.push("/login")}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "white",
                  color: "#374151",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "1px solid #d1d5db",
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
