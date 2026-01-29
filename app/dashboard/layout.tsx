"use client";

import { ProtectedRoute } from "@/shared/components/protected-route";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      exact: true,
    },
    {
      href: "/dashboard/surveys",
      label: "My Surveys",
      icon: (
        <svg
          width="20"
          height="20"
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
    },
    {
      href: "/dashboard/groups",
      label: "My Groups",
      icon: (
        <svg
          width="20"
          height="20"
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
    },
  ];

  function isActive(href: string, exact?: boolean) {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <ProtectedRoute>
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f8fafc",
          display: "flex",
        }}
      >
        <aside
          style={{
            width: "260px",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            padding: "24px 16px",
            flexShrink: 0,
            position: "sticky",
            top: "64px",
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <div style={{ marginBottom: "24px", padding: "0 12px" }}>
            <h2
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: 0,
              }}
            >
              Dashboard
            </h2>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "10px",
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
                      e.currentTarget.style.color = "#0f172a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            style={{
              marginTop: "32px",
              padding: "20px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155",
                margin: "0 0 12px 0",
              }}
            >
              Quick Actions
            </h3>
            <Link
              href="/dashboard/surveys"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Survey
            </Link>
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
