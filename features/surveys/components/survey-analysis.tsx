"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import type { SurveyAnalysisResponse } from "@/shared/types/survey.types";

interface SurveyAnalysisProps {
  surveyId: string;
}

const CHART_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
];

export function SurveyAnalysis({ surveyId }: SurveyAnalysisProps) {
  const [analysis, setAnalysis] = useState<SurveyAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [surveyId]);

  async function loadAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const data = await surveyService.analyzeSurvey(surveyId);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analysis");
    } finally {
      setLoading(false);
    }
  }

  function formatDuration(duration: string): string {
    const parts = duration.split(":");
    if (parts.length >= 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseFloat(parts[2]).toFixed(1);

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    }
    return duration;
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#6b7280" }}>
            Loading analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#dc2626", marginBottom: "16px" }}>
            <svg
              style={{ width: "64px", height: "64px", margin: "0 auto" }}
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
          <p style={{ fontWeight: 500, marginBottom: "8px" }}>
            Failed to load analysis
          </p>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>{error}</p>
          <button
            onClick={loadAnalysis}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div style={{ textAlign: "center", padding: "48px" }}>
        <p>No analysis data available</p>
      </div>
    );
  }

  const allQuestions = [
    ...analysis.questionAnalysis.singleQuestionAnalysis.map((q) => ({
      ...q,
      type: "option" as const,
    })),
    ...analysis.openQuestionAnalysis.map((q) => ({
      ...q,
      type: "open" as const,
    })),
  ].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            margin: 0,
            color: "#111827",
          }}
        >
          Survey Analysis
        </h1>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Detailed insights and statistics from survey responses
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#dbeafe",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2563eb"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Total Responses
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {analysis.statisticAnalysis.totalResponse}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#d1fae5",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#059669"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Completion Rate
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {analysis.statisticAnalysis.completionRatio.toFixed(1)}%
              </p>
            </div>
          </div>
          <div
            style={{
              height: "6px",
              backgroundColor: "#e5e7eb",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${analysis.statisticAnalysis.completionRatio}%`,
                backgroundColor: "#10b981",
                borderRadius: "3px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fef3c7",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#d97706"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Avg. Duration
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {formatDuration(analysis.statisticAnalysis.avgDuration)}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#f3e8ff",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#7c3aed"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                Skipped Questions
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {analysis.questionAnalysis.unsolvedRatio.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "20px",
            color: "#111827",
          }}
        >
          Question Analysis
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {allQuestions.map((question, index) => (
            <div
              key={`${question.type}-${question.order}`}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {question.order}
                </span>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      margin: 0,
                      color: "#111827",
                    }}
                  >
                    {question.questionText}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "9999px",
                      backgroundColor:
                        question.type === "open" ? "#dbeafe" : "#d1fae5",
                      color: question.type === "open" ? "#1e40af" : "#065f46",
                    }}
                  >
                    {question.type === "open" ? "Open Text" : "Choice Question"}
                  </span>
                </div>
              </div>

              {question.type === "option" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {question.optionAnalysisInfo
                      .sort((a, b) => a.order - b.order)
                      .map((option, optIndex) => (
                        <div key={option.order}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "4px",
                              fontSize: "14px",
                            }}
                          >
                            <span style={{ color: "#374151", fontWeight: 500 }}>
                              {option.optionText}
                            </span>
                            <span style={{ color: "#6b7280" }}>
                              {option.ratio.toFixed(1)}%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "24px",
                              backgroundColor: "#f3f4f6",
                              borderRadius: "6px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${option.ratio}%`,
                                backgroundColor:
                                  CHART_COLORS[optIndex % CHART_COLORS.length],
                                borderRadius: "6px",
                                transition: "width 0.5s ease",
                                minWidth: option.ratio > 0 ? "4px" : "0",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div
                    style={{
                      marginTop: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "32px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "180px",
                        height: "180px",
                      }}
                    >
                      <svg
                        viewBox="0 0 100 100"
                        style={{ transform: "rotate(-90deg)" }}
                      >
                        {(() => {
                          let cumulativePercent = 0;
                          return question.optionAnalysisInfo
                            .sort((a, b) => a.order - b.order)
                            .map((option, optIndex) => {
                              const percent = option.ratio;
                              const strokeDasharray = `${percent} ${100 - percent}`;
                              const strokeDashoffset = -cumulativePercent;
                              cumulativePercent += percent;

                              return (
                                <circle
                                  key={option.order}
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  stroke={
                                    CHART_COLORS[optIndex % CHART_COLORS.length]
                                  }
                                  strokeWidth="20"
                                  strokeDasharray={strokeDasharray}
                                  strokeDashoffset={strokeDashoffset}
                                  style={{
                                    transition: "stroke-dasharray 0.5s ease",
                                  }}
                                />
                              );
                            });
                        })()}
                      </svg>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {question.optionAnalysisInfo
                        .sort((a, b) => a.order - b.order)
                        .map((option, optIndex) => (
                          <div
                            key={option.order}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "2px",
                                backgroundColor:
                                  CHART_COLORS[optIndex % CHART_COLORS.length],
                              }}
                            />
                            <span
                              style={{ fontSize: "13px", color: "#374151" }}
                            >
                              {option.optionText} ({option.ratio.toFixed(1)}%)
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {question.type === "open" && (
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "12px",
                    }}
                  >
                    {question.answers.length} responses
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {question.answers.map((answer, ansIndex) => (
                      <div
                        key={ansIndex}
                        style={{
                          padding: "12px 16px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#374151",
                          borderLeft: "3px solid #3b82f6",
                        }}
                      >
                        "{answer}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
