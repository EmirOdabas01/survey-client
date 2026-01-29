"use client";

import { useState, useEffect } from "react";
import { groupService } from "../services/group.service";
import { GroupCard } from "./group-card";
import type { Group } from "@/shared/types/group.types";

interface GroupListProps {
  onGroupEnrolled?: (groupId: number) => void;
}

export function GroupList({ onGroupEnrolled }: GroupListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    setLoading(true);
    setError(null);
    try {
      const response = await groupService.getAllGroups();
      setGroups(response.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "240px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "14px" }}>
            Loading groups...
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

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#fef2f2",
          borderRadius: "16px",
          padding: "32px",
          textAlign: "center",
          border: "1px solid #fecaca",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#fee2e2",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#dc2626"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p
          style={{
            fontWeight: 600,
            marginBottom: "8px",
            color: "#991b1b",
            fontSize: "16px",
          }}
        >
          Failed to load groups
        </p>
        <p style={{ color: "#dc2626", marginBottom: "20px", fontSize: "14px" }}>
          {error}
        </p>
        <button
          onClick={loadGroups}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc2626",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "48px 32px",
          textAlign: "center",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#f1f5f9",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="32"
            height="32"
            fill="none"
            stroke="#94a3b8"
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
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#334155",
          }}
        >
          No groups available
        </h3>
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            margin: 0,
          }}
        >
          Check back later for new groups to join
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onEnrolled={onGroupEnrolled} />
      ))}
    </div>
  );
}
