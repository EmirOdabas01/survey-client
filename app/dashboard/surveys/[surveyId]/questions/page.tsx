"use client";

import { useParams, useRouter } from "next/navigation";
import { SurveyQuestions } from "@/features/surveys/components/survey-questions";

export default function SurveyQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  function handleBack() {
    router.push("/dashboard/surveys");
  }

  return (
    <div
      style={{
        padding: "32px 40px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <button
        onClick={handleBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "28px",
          color: "#64748b",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.15s ease",
          marginLeft: "-12px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e2e8f0";
          e.currentTarget.style.color = "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#64748b";
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
        Back to Surveys
      </button>

      <SurveyQuestions surveyId={surveyId} />
    </div>
  );
}
