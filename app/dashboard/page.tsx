"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/context/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    {
      href: "/dashboard/surveys",
      title: "My Surveys",
      description: "Create, edit, and manage your surveys",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      href: "/dashboard/groups",
      title: "My Groups",
      description: "View your groups and manage memberships",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "#16a34a",
      bgColor: "#f0fdf4",
    },
    {
      href: "/",
      title: "Browse Surveys",
      description: "Discover and participate in surveys",
      icon: (
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px 0",
          }}
        >
          Welcome back,{" "}
          {user?.userInfo.userName || user?.userInfo.nameSurname || "User"}!
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#64748b",
            margin: 0,
          }}
        >
          Here's what you can do from your dashboard
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#eff6ff",
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
                stroke="#2563eb"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                }}
              >
                Account Status
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#0f172a",
          margin: "0 0 20px 0",
        }}
      >
        Quick Access
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -8px rgba(0, 0, 0, 0.12)";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: card.bgColor,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 8px 0",
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
