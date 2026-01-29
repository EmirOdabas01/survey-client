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
  const [starting, setStarting] = useState(false);

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
        if (imageData?.path && imageData.path !== "//") {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
          const baseUrl = apiBaseUrl.replace("/api", "");
          const cleanPath = imageData.path.replace(/\\/g, "/");
          const fullImageUrl = `${baseUrl}${cleanPath}`;
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
    setStarting(true);
    try {
      const response = await surveyService.startSurvey(surveyId);
      setResponseId(response.responseId);
      setIsTaking(true);
    } catch (err) {
      setStartingError(
        err instanceof Error ? err.message : "Failed to start survey",
      );
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "15px" }}>
            Loading survey...
          </p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          padding: "48px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#dc2626"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              color: "#0f172a",
              fontSize: "17px",
            }}
          >
            Failed to load survey
          </p>
          <p
            style={{ color: "#64748b", marginBottom: "24px", fontSize: "15px" }}
          >
            {error}
          </p>
          <button
            onClick={loadSurveyDetail}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 600, color: "#0f172a" }}>Survey not found</p>
        </div>
      </div>
    );
  }

  if (isTaking && responseId !== null) {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            border: "1px solid #e2e8f0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#eff6ff",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#2563eb"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px 0",
            }}
          >
            {survey.name}
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
            {survey.description}
          </p>
        </div>

        <SurveyTaking surveyId={surveyId} responseId={responseId} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            height: "240px",
            width: "100%",
            backgroundColor: "#f1f5f9",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {imagePath ? (
            <>
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
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "100px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              />
            </>
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
                width="64"
                height="64"
                fill="none"
                stroke="#94a3b8"
                viewBox="0 0 24 24"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          )}
        </div>

        <div style={{ padding: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 12px 0",
              lineHeight: 1.3,
            }}
          >
            {survey.name}
          </h1>
          <p
            style={{
              color: "#64748b",
              marginBottom: "32px",
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            {survey.description}
          </p>

          <button
            onClick={handleStartSurvey}
            disabled={starting}
            style={{
              padding: "16px 48px",
              backgroundColor: starting ? "#93c5fd" : "#2563eb",
              color: "white",
              fontSize: "16px",
              fontWeight: 600,
              borderRadius: "12px",
              border: "none",
              cursor: starting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => {
              if (!starting) {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(37, 99, 235, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!starting) {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(37, 99, 235, 0.3)";
              }
            }}
          >
            {starting ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Starting...
              </>
            ) : (
              <>
                Start Survey
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
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </>
            )}
          </button>

          {startingError && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px 16px",
                backgroundColor: "#fef2f2",
                borderRadius: "10px",
                border: "1px solid #fecaca",
              }}
            >
              <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
                {startingError}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
