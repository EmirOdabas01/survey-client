"use client";

import { useRouter } from "next/navigation";
import { SurveyList } from "@/features/surveys/components/survey-list";

export default function GroupSurveysPage() {
  const router = useRouter();

  function handleSurveyClick(surveyId: string) {
    router.push(`/s/${surveyId}`);
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
      <div style={{ marginBottom: "32px" }}>
        <button
          onClick={() => router.push("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "20px",
            color: "#64748b",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 12px",
            marginLeft: "-12px",
            borderRadius: "8px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f1f5f9";
            e.currentTarget.style.color = "#334155";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#64748b";
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.15)",
            }}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#f97316"
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
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Group Surveys
            </h1>
            <p style={{ color: "#64748b", marginTop: "4px", fontSize: "15px" }}>
              Surveys from your groups
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "28px",
          padding: "16px 20px",
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          borderRadius: "12px",
          border: "1px solid #fde68a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#fef08a",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#a16207"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <span style={{ fontSize: "14px", color: "#92400e", fontWeight: 500 }}>
            Want to see more surveys? Join more groups!
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard/groups")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f59e0b",
            color: "white",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#d97706";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f59e0b";
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

      <SurveyList type="group" onSurveyClick={handleSurveyClick} />
    </div>
  );
}
