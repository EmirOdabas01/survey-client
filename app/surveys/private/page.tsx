"use client";

import { SurveyList } from "@/features/surveys/components/survey-list";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { useRouter } from "next/navigation";

export default function PrivateSurveysPage() {
  const router = useRouter();

  function handleSurveyClick(surveyId: string) {
    router.push(`/s/${surveyId}`);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Private Surveys
            </h1>
            <p className="text-gray-600">
              Surveys created by you and shared with you privately
            </p>
          </div>

          <SurveyList onSurveyClick={handleSurveyClick} surveyType="private" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
