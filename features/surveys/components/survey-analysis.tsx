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
      const seconds = parseFloat(parts[2]).toFixed(0);

      if (hours > 0) {
        return `${hours}h ${minutes}m`;
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
              width: "52px",
              height: "52px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "20px", color: "#64748b", fontSize: "15px" }}>
            Analyzing responses...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            backgroundColor: "white",
            padding: "48px",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            maxWidth: "400px",
          }}
        >
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              fontSize: "17px",
              color: "#0f172a",
            }}
          >
            Failed to load analysis
          </p>
          <p
            style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}
          >
            {error}
          </p>
          <button
            onClick={loadAnalysis}
            style={{
              padding: "10px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "14px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1d4ed8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2563eb")
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px",
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#f1f5f9",
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
            stroke="#94a3b8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          No analysis data available
        </p>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
              color: "#0f172a",
            }}
          >
            Survey Analysis
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "15px" }}>
            Detailed insights and statistics from survey responses
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#eff6ff",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
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
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Total Responses
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "4px 0 0 0",
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
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#dcfce7",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="#16a34a"
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
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Completion Rate
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "4px 0 0 0",
                }}
              >
                {analysis.statisticAnalysis.completionRatio.toFixed(1)}%
              </p>
            </div>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${analysis.statisticAnalysis.completionRatio}%`,
                background: "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)",
                borderRadius: "4px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#fef3c7",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
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
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Avg. Duration
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "4px 0 0 0",
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
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                backgroundColor: "#f3e8ff",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
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
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Skipped Questions
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "4px 0 0 0",
                }}
              >
                {analysis.questionAnalysis.unsolvedRatio.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#f1f5f9",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#475569"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: 0,
              color: "#0f172a",
            }}
          >
            Question Analysis
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {allQuestions.map((question) => (
            <div
              key={`${question.type}-${question.order}`}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "white",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {question.order}
                </span>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      margin: 0,
                      color: "#0f172a",
                      lineHeight: 1.4,
                    }}
                  >
                    {question.questionText}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "10px",
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      backgroundColor:
                        question.type === "open" ? "#eff6ff" : "#dcfce7",
                      color: question.type === "open" ? "#1d4ed8" : "#15803d",
                    }}
                  >
                    {question.type === "open" ? (
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    )}
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
                      gap: "14px",
                      marginBottom: "32px",
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
                              marginBottom: "6px",
                              fontSize: "14px",
                            }}
                          >
                            <span style={{ color: "#334155", fontWeight: 500 }}>
                              {option.optionText}
                            </span>
                            <span
                              style={{
                                color: "#64748b",
                                fontWeight: 600,
                                fontSize: "13px",
                              }}
                            >
                              {option.ratio.toFixed(1)}%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "28px",
                              backgroundColor: "#f1f5f9",
                              borderRadius: "8px",
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
                                borderRadius: "8px",
                                transition: "width 0.5s ease",
                                minWidth: option.ratio > 0 ? "8px" : "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                paddingRight: option.ratio > 15 ? "10px" : "0",
                              }}
                            >
                              {option.ratio > 15 && (
                                <span
                                  style={{
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {option.ratio.toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "48px",
                      flexWrap: "wrap",
                      padding: "24px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "160px",
                        height: "160px",
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
                        gap: "10px",
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
                              gap: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "14px",
                                height: "14px",
                                borderRadius: "4px",
                                backgroundColor:
                                  CHART_COLORS[optIndex % CHART_COLORS.length],
                              }}
                            />
                            <span
                              style={{ fontSize: "14px", color: "#334155" }}
                            >
                              {option.optionText}
                            </span>
                            <span
                              style={{
                                fontSize: "13px",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              ({option.ratio.toFixed(1)}%)
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {question.type === "open" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#64748b"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      {question.answers.length} responses
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      maxHeight: "320px",
                      overflowY: "auto",
                      paddingRight: "8px",
                    }}
                  >
                    {question.answers.map((answer, ansIndex) => (
                      <div
                        key={ansIndex}
                        style={{
                          padding: "14px 18px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "10px",
                          fontSize: "14px",
                          color: "#334155",
                          borderLeft: "4px solid #3b82f6",
                          lineHeight: 1.5,
                        }}
                      >
                        {answer}
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
