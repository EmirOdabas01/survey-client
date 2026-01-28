"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { surveyService } from "../services/survey.service";
import { SurveyCard } from "./survey-card";
import type { Survey } from "@/shared/types/survey.types";

interface SurveyListProps {
  type: "public" | "private" | "group";
  onSurveyClick?: (surveyId: string) => void;
}

export function SurveyList({ type, onSurveyClick }: SurveyListProps) {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresAuth, setRequiresAuth] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, [type]);

  async function loadSurveys() {
    setLoading(true);
    setError(null);
    setRequiresAuth(false);

    try {
      let response;
      switch (type) {
        case "public":
          response = await surveyService.getPublicSurveys();
          break;
        case "private":
          response = await surveyService.getPrivateSurveys();
          break;
        case "group":
          response = await surveyService.getGroupSurveys();
          break;
      }
      setSurveys(response.surveys);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load surveys";

      if (
        errorMessage.includes("401") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("not authenticated") ||
        errorMessage.includes("token")
      ) {
        setRequiresAuth(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClick(surveyId: string) {
    if (onSurveyClick) {
      onSurveyClick(surveyId);
    } else {
      router.push(`/s/${surveyId}`);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "12px", color: "#6b7280", fontSize: "14px" }}>
            Loading surveys...
          </p>
        </div>
      </div>
    );
  }

  if (requiresAuth) {
    return (
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: type === "private" ? "#f3e8ff" : "#ffedd5",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          {type === "private" ? (
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#a855f7"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#f97316"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
        </div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111827",
          }}
        >
          {type === "private" ? "Private Surveys" : "Group Surveys"}
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "20px", fontSize: "14px" }}>
          {type === "private"
            ? "Login to see surveys shared directly with you"
            : "Login to see surveys from your groups"}
        </p>
        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "8px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Login to View
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#fef2f2",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
          border: "1px solid #fecaca",
        }}
      >
        <div style={{ color: "#dc2626", marginBottom: "12px" }}>
          <svg
            style={{ width: "40px", height: "40px", margin: "0 auto" }}
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
        <p style={{ fontWeight: 500, marginBottom: "8px", color: "#991b1b" }}>
          Failed to load surveys
        </p>
        <p style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </p>
        <button
          onClick={loadSurveys}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc2626",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ color: "#9ca3af", marginBottom: "12px" }}>
          <svg
            style={{ width: "48px", height: "48px", margin: "0 auto" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p style={{ fontWeight: 500, color: "#374151" }}>
          No surveys available
        </p>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
          {type === "public" && "Check back later for new public surveys"}
          {type === "private" &&
            "No one has shared private surveys with you yet"}
          {type === "group" && "Your groups have no surveys yet"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 350px))",
        gap: "24px",
        justifyContent: "start",
      }}
    >
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} onClick={handleClick} />
      ))}
    </div>
  );
}
