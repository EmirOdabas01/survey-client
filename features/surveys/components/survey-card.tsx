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

  useEffect(() => {
    loadSurveyImage();
  }, [survey.id]);

  async function loadSurveyImage() {
    try {
      const imageData = await surveyService.getSurveyImage(survey.id);
      if (imageData?.path) {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const baseUrl = apiBaseUrl.replace("/api", "");

        const cleanPath = imageData.path.replace(/\\/g, "/");

        const fullImageUrl = `${baseUrl}${cleanPath}/${survey.id}.png`;
        setImagePath(fullImageUrl);
      }
    } catch (error) {}
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
      {imagePath && (
        <div className="h-48 bg-gray-200">
          <img
            src={imagePath}
            alt={survey.name}
            className="w-full h-full object-cover"
            onError={() => setImagePath(null)}
          />
        </div>
      )}

      <div className={`p-4 ${!imagePath ? "pt-6" : ""}`}>
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
