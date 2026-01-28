"use client";

import { useRouter } from "next/navigation";
import { SurveyList } from "@/features/surveys/components/survey-list";

export default function GroupSurveysPage() {
  const router = useRouter();

  function handleSurveyClick(surveyId: string) {
    router.push(`/s/${surveyId}`);
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            color: "#4b5563",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#ffedd5",
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
              stroke="#f97316"
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
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: 0,
                color: "#111827",
              }}
            >
              Group Surveys
            </h1>
            <p style={{ color: "#6b7280", marginTop: "4px" }}>
              Surveys from your groups
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#fffbeb",
          borderRadius: "8px",
          border: "1px solid #fef3c7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="#d97706"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span style={{ fontSize: "14px", color: "#92400e" }}>
            Want to see more surveys? Join more groups!
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard/groups")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f59e0b",
            color: "white",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Manage Groups
        </button>
      </div>

      <SurveyList type="group" onSurveyClick={handleSurveyClick} />
    </div>
  );
}
