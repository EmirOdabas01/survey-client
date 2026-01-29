"use client";

import { useState } from "react";
import { groupService } from "../services/group.service";
import type { Group } from "@/shared/types/group.types";

interface GroupCardProps {
  group: Group;
  onEnrolled?: (groupId: number) => void;
}

export function GroupCard({ group, onEnrolled }: GroupCardProps) {
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await groupService.enrollToGroup(group.id);
      setEnrolled(true);
      if (onEnrolled) {
        onEnrolled(group.id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "360px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 12px 24px -8px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          padding: "24px 24px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#f0fdf4",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#16a34a"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 4px 0",
              lineHeight: 1.4,
            }}
          >
            {group.name}
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {group.description}
          </p>
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        {enrolled ? (
          <div
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "10px",
              border: "1px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Successfully Joined!
          </div>
        ) : (
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: enrolling ? "#86efac" : "#16a34a",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "10px",
              border: "none",
              cursor: enrolling ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!enrolling) {
                e.currentTarget.style.backgroundColor = "#15803d";
              }
            }}
            onMouseLeave={(e) => {
              if (!enrolling) {
                e.currentTarget.style.backgroundColor = "#16a34a";
              }
            }}
          >
            {enrolling ? (
              <>
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
                Joining...
              </>
            ) : (
              <>
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Join Group
              </>
            )}
          </button>
        )}
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
