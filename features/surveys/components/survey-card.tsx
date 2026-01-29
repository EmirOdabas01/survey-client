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
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    loadSurveyImage();
  }, [survey.id]);

  async function loadSurveyImage() {
    try {
      const imageData = await surveyService.getSurveyImage(survey.id);
      if (imageData?.path && imageData.path !== "//") {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const baseUrl = apiBaseUrl.replace("/api", "");
        const cleanPath = imageData.path.replace(/\\/g, "/");
        const fullImageUrl = `${baseUrl}${cleanPath}`;
        setImagePath(fullImageUrl);
      }
    } catch (error) {
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
      style={{
        maxWidth: "360px",
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow =
          "0 12px 24px -8px rgba(0, 0, 0, 0.15)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          height: "160px",
          width: "100%",
          backgroundColor: "#f1f5f9",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {imagePath ? (
          <img
            src={imagePath}
            alt={survey.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={() => setImagePath(null)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)",
            }}
          >
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="#94a3b8"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
      </div>

      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 600,
            color: "#0f172a",
            margin: "0 0 8px 0",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {survey.name}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            margin: 0,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {survey.description}
        </p>
      </div>

      <div
        style={{
          padding: "0 20px 20px",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
          }}
        >
          Take Survey
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
