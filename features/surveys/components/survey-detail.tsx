"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { SurveyTaking } from "./survey-taking";
import type { SurveyDetail } from "@/shared/types/survey.types";

interface SurveyDetailProps {
  surveyId: string;
}

export function SurveyDetailView({ surveyId }: SurveyDetailProps) {
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isTaking, setIsTaking] = useState(false);
  const [responseId, setResponseId] = useState<number | null>(null);
  const [startingError, setStartingError] = useState<string | null>(null);

  useEffect(() => {
    loadSurveyDetail();
  }, [surveyId]);

  async function loadSurveyDetail() {
    setLoading(true);
    setError(null);
    try {
      const surveyData = await surveyService.getSurveyById(surveyId);
      setSurvey(surveyData);

      try {
        const imageData = await surveyService.getSurveyImage(surveyId);
        if (imageData?.path) {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
          const baseUrl = apiBaseUrl.replace("/api", "");
          const fullImageUrl = `${baseUrl}${imageData.path}`;
          setImagePath(fullImageUrl);
        }
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load survey");
    } finally {
      setLoading(false);
    }
  }
  async function handleStartSurvey() {
    setStartingError(null);
    try {
      const response = await surveyService.startSurvey(surveyId);
      setResponseId(response.responseId);
      setIsTaking(true);
    } catch (err) {
      setStartingError(
        err instanceof Error ? err.message : "Failed to start survey",
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
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
            Failed to load survey
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSurveyDetail}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-900 font-medium">Survey not found</p>
        </div>
      </div>
    );
  }

  if (isTaking && responseId !== null) {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {survey.name}
          </h1>
          <p className="text-gray-600 text-center mt-2">{survey.description}</p>
        </div>

        <SurveyTaking surveyId={surveyId} responseId={responseId} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {imagePath && (
          <div
            style={{ height: "250px", width: "100%" }}
            className="overflow-hidden bg-gray-100"
          >
            <img
              src={imagePath}
              alt={survey.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={() => setImagePath(null)}
            />
          </div>
        )}

        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {survey.name}
          </h1>
          <p className="text-gray-600 mb-8">{survey.description}</p>

          <button
            onClick={handleStartSurvey}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-lg"
          >
            Start Survey
          </button>

          {startingError && (
            <p className="mt-4 text-red-600">{startingError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
