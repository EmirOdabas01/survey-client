"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import type { Survey } from "@/shared/types/survey.types";

interface SurveyCardProps {
  survey: Survey;
  onClick?: (surveyId: string) => void;
}

export function SurveyCard({ survey, onClick }: SurveyCardProps) {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    loadSurveyImage();
  }, [survey.id]);

  async function loadSurveyImage() {
    setImageLoading(true);
    try {
      const imageData = await surveyService.getSurveyImage(survey.id);
      setImagePath(imageData.path);
    } catch (error) {
      console.error("failed to load survey image", error);
      setImagePath(null);
    } finally {
      setImageLoading(false);
    }
  }

  function handleClick() {
    if (onClick) {
      onClick(survey.id);
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
    >
      <div className="h-48 bg-gray-200 relative">
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : imagePath ? (
          <img
            src={imagePath}
            alt={survey.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
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
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {survey.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {survey.description}
        </p>
      </div>

      <div className="px-4 pb-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
          View Survey
        </button>
      </div>
    </div>
  );
}
