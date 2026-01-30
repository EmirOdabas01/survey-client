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
  const [isHovered, setIsHovered] = useState(false);

  const hasImage = survey.path && survey.path !== "//" && !imageError;
  const imageUrl = hasImage
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${survey.path?.replace(/\\/g, "/")}`
    : null;

  function formatDate(dateString: string | null): string {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getStateBadgeStyles(state: string): React.CSSProperties {
    switch (state) {
      case "Planned":
        return { backgroundColor: "#fef3c7", color: "#b45309" };
      case "Open":
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case "Closed":
        return { backgroundColor: "#f1f5f9", color: "#475569" };
      default:
        return { backgroundColor: "#f1f5f9", color: "#475569" };
    }
  }

  function getVisibilityBadgeStyles(visibility: string): React.CSSProperties {
    switch (visibility) {
      case "Public":
        return { backgroundColor: "#eff6ff", color: "#1d4ed8" };
      case "Private":
        return { backgroundColor: "#f3e8ff", color: "#7c3aed" };
      case "Group":
        return { backgroundColor: "#fff7ed", color: "#c2410c" };
      default:
        return { backgroundColor: "#f1f5f9", color: "#475569" };
    }
  }

  const secondaryButtonStyle: React.CSSProperties = {
    padding: "10px 12px",
    backgroundColor: "#f1f5f9",
    color: "#334155",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.15s ease",
  };

  return (
    <div
      style={{
        maxWidth: "360px",
        width: "100%",
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: isHovered
          ? "0 8px 24px -8px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "all 0.2s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "relative",
          height: "140px",
          background: imageUrl
            ? "white"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={survey.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#f8fafc",
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="#94a3b8"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            gap: "8px",
          }}
        >
          <span
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              ...getStateBadgeStyles(survey.state),
            }}
          >
            {survey.state}
          </span>
          <span
            style={{
              padding: "5px 10px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              ...getVisibilityBadgeStyles(survey.visibility),
            }}
          >
            {survey.visibility}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#0f172a",
            marginBottom: "6px",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {survey.name}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            marginBottom: "16px",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "42px",
          }}
        >
          {survey.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            padding: "12px",
            backgroundColor: "#f8fafc",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: "0 0 2px 0",
                fontWeight: 500,
              }}
            >
              Start
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#334155",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {formatDate(survey.startDate)}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: "0 0 2px 0",
                fontWeight: 500,
              }}
            >
              End
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#334155",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {formatDate(survey.endDate)}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: "0 0 2px 0",
                fontWeight: 500,
              }}
            >
              Min
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#334155",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {survey.minResponse}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                margin: "0 0 2px 0",
                fontWeight: 500,
              }}
            >
              Max
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#334155",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {survey.maxResponse}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "12px" }}>
          {survey.state === "Planned" && (
            <button
              onClick={() => onPublish(survey.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#16a34a",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#15803d")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#16a34a")
              }
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
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Publish Survey
            </button>
          )}
          {survey.state === "Open" && (
            <button
              onClick={() => onClose(survey.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#f97316",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#ea580c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f97316")
              }
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
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Close Survey
            </button>
          )}
          {survey.state === "Closed" && (
            <button
              onClick={() => onAnalyze(survey.id)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
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
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analyze Results
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <button
            onClick={() =>
              survey.state === "Planned" && onViewQuestions(survey.id)
            }
            disabled={survey.state !== "Planned"}
            style={{
              ...secondaryButtonStyle,
              opacity: survey.state !== "Planned" ? 0.5 : 1,
              cursor: survey.state !== "Planned" ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (survey.state === "Planned") {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            title={
              survey.state !== "Planned"
                ? "Questions can only be modified when survey is Planned"
                : ""
            }
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Questions
          </button>

          <button
            onClick={() => survey.state === "Planned" && onUpdate(survey)}
            disabled={survey.state !== "Planned"}
            style={{
              ...secondaryButtonStyle,
              opacity: survey.state !== "Planned" ? 0.5 : 1,
              cursor: survey.state !== "Planned" ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (survey.state === "Planned") {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            title={
              survey.state !== "Planned"
                ? "Survey can only be edited when Planned"
                : ""
            }
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          {hasImage ? (
            <button
              onClick={() => onRemoveImage(survey.id)}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Remove Img
            </button>
          ) : (
            <button
              onClick={() => onUploadImage(survey.id)}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f1f5f9";
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Add Image
            </button>
          )}

          <button
            onClick={() => onDelete(survey.id)}
            style={{
              ...secondaryButtonStyle,
              backgroundColor: "#fef2f2",
              color: "#dc2626",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
