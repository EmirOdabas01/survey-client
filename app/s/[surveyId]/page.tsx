"use client";

import { useParams, useRouter } from "next/navigation";
import { SurveyDetailView } from "@/features/surveys/components/survey-detail";

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  function handleGoBack() {
    router.back();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
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

        <SurveyDetailView surveyId={surveyId} />
      </div>
    </div>
  );
}
