"use client";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "15px" }}>
            Loading...
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

  return (
    <div
      style={{
        padding: "40px 24px",
        maxWidth: "1280px",
        margin: "0 auto",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          marginBottom: "48px",
          textAlign: user ? "left" : "center",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 800,
            margin: 0,
            color: "#0f172a",
            letterSpacing: "-0.025em",
          }}
        >
          {user
            ? `Welcome back, ${user.userInfo.userName || user.userInfo.nameSurname}`
            : "Discover & Share Surveys"}
        </h1>
        <p
          style={{
            color: "#64748b",
            marginTop: "12px",
            fontSize: "17px",
            maxWidth: user ? "none" : "500px",
            margin: user ? "12px 0 0 0" : "12px auto 0",
          }}
        >
          {user
            ? "Explore surveys, join groups, and share your opinions"
            : "Join thousands of users creating and participating in surveys"}
        </p>
      </div>

      {user && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          <div
            onClick={() => router.push("/surveys/private")}
            style={{
              background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
              borderRadius: "16px",
              padding: "24px",
              cursor: "pointer",
              border: "1px solid #e9d5ff",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -8px rgba(139, 92, 246, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#5b21b6",
                  }}
                >
                  Private Surveys
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#7c3aed",
                    margin: "4px 0 0 0",
                  }}
                >
                  Surveys shared directly with you
                </p>
              </div>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#8b5cf6"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <div
            onClick={() => router.push("/surveys/groups")}
            style={{
              background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
              borderRadius: "16px",
              padding: "24px",
              cursor: "pointer",
              border: "1px solid #fed7aa",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -8px rgba(249, 115, 22, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#f97316",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#9a3412",
                  }}
                >
                  Group Surveys
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#ea580c",
                    margin: "4px 0 0 0",
                  }}
                >
                  Surveys from your groups
                </p>
              </div>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#f97316"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <div
            onClick={() => router.push("/dashboard/surveys")}
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderRadius: "16px",
              padding: "24px",
              cursor: "pointer",
              border: "1px solid #bfdbfe",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -8px rgba(37, 99, 235, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#2563eb",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: 0,
                    color: "#1e40af",
                  }}
                >
                  My Surveys
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#3b82f6",
                    margin: "4px 0 0 0",
                  }}
                >
                  Manage your created surveys
                </p>
              </div>
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2563eb"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <section style={{ marginBottom: "56px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Public Surveys
            </h2>
            <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
              Open for everyone to participate
            </p>
          </div>
          <span
            style={{
              padding: "6px 14px",
              backgroundColor: "#eff6ff",
              color: "#1d4ed8",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 600,
              border: "1px solid #bfdbfe",
            }}
          >
            <span style={{ marginRight: "6px" }}>🌐</span>
            Open to all
          </span>
        </div>
        <SurveyList type="public" onSurveyClick={handleSurveyClick} />
      </section>

      {user && (
        <section style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Available Groups
              </h2>
              <p
                style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}
              >
                Join groups to access exclusive surveys
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/groups")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Groups
            </button>
          </div>
          <GroupList />
        </section>
      )}

      {!user && (
        <section style={{ marginTop: "64px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "20px",
              padding: "48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-30px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  stroke="#60a5fa"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>

              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 12px 0",
                }}
              >
                Ready to get started?
              </h3>
              <p
                style={{
                  color: "#94a3b8",
                  marginBottom: "32px",
                  fontSize: "16px",
                  maxWidth: "400px",
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Create an account to access private surveys, join groups, and
                create your own surveys.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => router.push("/register")}
                  style={{
                    padding: "14px 32px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => router.push("/login")}
                  style={{
                    padding: "14px 32px",
                    backgroundColor: "transparent",
                    color: "#e2e8f0",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "1px solid #475569",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.borderColor = "#64748b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#475569";
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
