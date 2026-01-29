"use client";

import { useParams, useRouter } from "next/navigation";
import { SurveyAnalysis } from "@/features/surveys/components/survey-analysis";

export default function SurveyAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  function handleBack() {
    router.push("/dashboard/surveys");
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <button
        onClick={handleBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
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
        Back to Surveys
      </button>

      <SurveyAnalysis surveyId={surveyId} />
    </div>
  );
}
