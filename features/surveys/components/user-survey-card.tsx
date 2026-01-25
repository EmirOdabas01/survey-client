"use client";

import { useState } from "react";
import type { UserSurvey } from "@/shared/types/survey.types";

interface UserSurveyCardProps {
  survey: UserSurvey;
  onPublish: (surveyId: string) => void;
  onClose: (surveyId: string) => void;
  onAnalyze: (surveyId: string) => void;
  onUpdate: (survey: UserSurvey) => void;
  onDelete: (surveyId: string) => void;
  onUploadImage: (surveyId: string) => void;
  onRemoveImage: (surveyId: string) => void;
  onViewQuestions: (surveyId: string) => void;
}

export function UserSurveyCard({
  survey,
  onPublish,
  onClose,
  onAnalyze,
  onUpdate,
  onDelete,
  onUploadImage,
  onRemoveImage,
  onViewQuestions,
}: UserSurveyCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    survey.path && !imageError
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${survey.path.replace(/\\/g, "/")}/${survey.id}.png`
      : null;

  function formatDate(dateString: string | null): string {
    if (!dateString) return "No end date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStateBadgeStyle(state: string): React.CSSProperties {
    switch (state) {
      case "Planned":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #f59e0b",
        };
      case "Open":
        return {
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #10b981",
        };
      case "Closed":
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #9ca3af",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #9ca3af",
        };
    }
  }

  function getVisibilityBadgeStyle(visibility: string): React.CSSProperties {
    switch (visibility) {
      case "Public":
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #3b82f6",
        };
      case "Private":
        return {
          backgroundColor: "#f3e8ff",
          color: "#6b21a8",
          border: "1px solid #a855f7",
        };
      case "Group":
        return {
          backgroundColor: "#ffedd5",
          color: "#9a3412",
          border: "1px solid #f97316",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #9ca3af",
        };
    }
  }

  return (
    <div
      style={{ maxWidth: "350px", width: "100%" }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div
        style={{ height: "140px", width: "100%", position: "relative" }}
        className="bg-gray-100 overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={survey.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg
              style={{ width: "60px", height: "60px" }}
              className="text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            display: "flex",
            gap: "8px",
          }}
        >
          <span
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "9999px",
              ...getStateBadgeStyle(survey.state),
            }}
          >
            {survey.state}
          </span>
          <span
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "9999px",
              ...getVisibilityBadgeStyle(survey.visibility),
            }}
          >
            {survey.visibility}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {survey.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{survey.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
          <div>
            <span className="font-medium">Start:</span>{" "}
            {formatDate(survey.startDate)}
          </div>
          <div>
            <span className="font-medium">End:</span>{" "}
            {formatDate(survey.endDate)}
          </div>
          <div>
            <span className="font-medium">Min:</span> {survey.minResponse}
          </div>
          <div>
            <span className="font-medium">Max:</span> {survey.maxResponse}
          </div>
        </div>

        <div className="mb-3">
          {survey.state === "Planned" && (
            <button
              onClick={() => onPublish(survey.id)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Publish Survey
            </button>
          )}
          {survey.state === "Open" && (
            <button
              onClick={() => onClose(survey.id)}
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Close Survey
            </button>
          )}
          {survey.state === "Closed" && (
            <button
              onClick={() => onAnalyze(survey.id)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Analyze Results
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewQuestions(survey.id)}
            className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
          >
            Questions
          </button>
          <button
            onClick={() => onUpdate(survey)}
            className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
          >
            Edit
          </button>
          {survey.path ? (
            <button
              onClick={() => onRemoveImage(survey.id)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Remove Image
            </button>
          ) : (
            <button
              onClick={() => onUploadImage(survey.id)}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors"
            >
              Upload Image
            </button>
          )}
          <button
            onClick={() => onDelete(survey.id)}
            className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
