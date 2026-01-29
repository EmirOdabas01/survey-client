"use client";

import { useRouter } from "next/navigation";
import { SurveyList } from "@/features/surveys/components/survey-list";

export default function PrivateSurveysPage() {
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
              background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
            }}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#8b5cf6"
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
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Private Surveys
            </h1>
            <p style={{ color: "#64748b", marginTop: "4px", fontSize: "15px" }}>
              Surveys shared directly with you
            </p>
          </div>
        </div>
      </div>

      <SurveyList type="private" onSurveyClick={handleSurveyClick} />
    </div>
  );
}
