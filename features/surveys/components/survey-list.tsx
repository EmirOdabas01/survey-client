"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { SurveyCard } from "./survey-card";
import type { Survey } from "@/shared/types/survey.types";

interface SurveyListProps {
  onSurveyClick?: (surveyId: string) => void;
  surveyType: "public" | "private" | "group";
}

export function SurveyList({ onSurveyClick, surveyType }: SurveyListProps) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurveys();
  }, [surveyType]);

  async function loadSurveys() {
    setLoading(true);
    setError(null);
    try {
      let response;

      switch (surveyType) {
        case "public":
          response = await surveyService.getPublicSurveys();
          break;
        case "private":
          response = await surveyService.getPrivateSurveys();
          break;
        case "group":
          response = await surveyService.getGroupSurveys();
          break;
        default:
          response = await surveyService.getPublicSurveys();
      }

      setSurveys(response.surveys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading surveys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">
            Failed to load surveys
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSurveys}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">No surveys available</p>
          <p className="text-gray-600">Check back later for new surveys</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Surveys</h2>
        <p className="text-gray-600 mt-1">
          {surveys.length} {surveys.length === 1 ? "survey" : "surveys"}{" "}
          available
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 350px))",
          gap: "24px",
          justifyContent: "start",
        }}
      >
        {surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} onClick={onSurveyClick} />
        ))}
      </div>
    </div>
  );
}
