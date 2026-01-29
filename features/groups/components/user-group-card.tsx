"use client";

import { useState } from "react";
import { groupService } from "../services/group.service";
import type { Group } from "@/shared/types/group.types";

interface UserGroupCardProps {
  group: Group;
  onLeft?: (groupId: number) => void;
}

export function UserGroupCard({ group, onLeft }: UserGroupCardProps) {
  const [leaving, setLeaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  async function handleLeave() {
    if (!confirm(`Are you sure you want to leave "${group.name}"?`)) {
      return;
    }

    setLeaving(true);
    try {
      await groupService.leaveGroup(group.id);
      alert(`Successfully left "${group.name}"`);
      if (onLeft) {
        onLeft(group.id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to leave group");
    } finally {
      setLeaving(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "360px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: isHovered
          ? "0 8px 24px -8px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "all 0.2s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          padding: "24px 24px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.25)",
          }}
        >
          <svg
            width="28"
            height="28"
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
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#0f172a",
            marginBottom: "8px",
            lineHeight: 1.3,
          }}
        >
          {group.name}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: 1.5,
            marginBottom: "0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {group.description}
        </p>
      </div>

      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            backgroundColor: "#f0fdf4",
            color: "#16a34a",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Member
        </span>
      </div>

      <div
        style={{
          padding: "0 20px 20px",
        }}
      >
        <button
          onClick={handleLeave}
          disabled={leaving}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: leaving ? "#fecaca" : "white",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: leaving ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: leaving ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!leaving) {
              e.currentTarget.style.backgroundColor = "#fef2f2";
              e.currentTarget.style.borderColor = "#fca5a5";
            }
          }}
          onMouseLeave={(e) => {
            if (!leaving) {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.borderColor = "#fecaca";
            }
          }}
        >
          {leaving ? (
            <>
              <svg
                width="16"
                height="16"
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
              Leaving...
            </>
          ) : (
            <>
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
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Leave Group
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
