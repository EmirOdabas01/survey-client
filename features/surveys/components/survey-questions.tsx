"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { QuestionType } from "@/shared/types/survey.types";
import { AddQuestionForm } from "./add-question-form";
import { EditQuestionForm } from "./edit-question-form";
import type { Question } from "@/shared/types/survey.types";

interface SurveyQuestionsProps {
  surveyId: string;
}

export function SurveyQuestions({ surveyId }: SurveyQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [surveyId]);

  async function loadQuestions() {
    setLoading(true);
    setError(null);
    try {
      const response = await surveyService.getSurveyQuestions(surveyId);
      const sortedQuestions = [...response.questions].sort(
        (a, b) => a.order - b.order,
      );
      setQuestions(sortedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  function getQuestionTypeName(type: QuestionType): string {
    switch (type) {
      case QuestionType.Open:
        return "Text Answer";
      case QuestionType.Dropdown:
        return "Dropdown";
      case QuestionType.MultipleChoice:
        return "Multiple Choice";
      case QuestionType.Logical:
        return "True / False";
      default:
        return "Unknown";
    }
  }

  function getQuestionTypeStyles(type: QuestionType): React.CSSProperties {
    switch (type) {
      case QuestionType.Open:
        return {
          backgroundColor: "#eff6ff",
          color: "#1d4ed8",
        };
      case QuestionType.Dropdown:
        return {
          backgroundColor: "#fef3c7",
          color: "#b45309",
        };
      case QuestionType.MultipleChoice:
        return {
          backgroundColor: "#dcfce7",
          color: "#15803d",
        };
      case QuestionType.Logical:
        return {
          backgroundColor: "#f3e8ff",
          color: "#7c3aed",
        };
      default:
        return {
          backgroundColor: "#f1f5f9",
          color: "#475569",
        };
    }
  }

  function getQuestionTypeIcon(type: QuestionType) {
    switch (type) {
      case QuestionType.Open:
        return (
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
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        );
      case QuestionType.Dropdown:
        return (
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        );
      case QuestionType.MultipleChoice:
        return (
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        );
      case QuestionType.Logical:
        return (
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
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        );
      default:
        return null;
    }
  }

  function handleAddQuestion() {
    setShowAddForm(true);
  }

  function handleQuestionAdded() {
    loadQuestions();
  }

  function handleEditQuestion(question: Question) {
    setEditingQuestion(question);
  }

  function handleQuestionUpdated() {
    loadQuestions();
  }

  async function handleDeleteQuestion(questionId: number) {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    setDeletingId(questionId);
    try {
      await surveyService.removeSingleQuestion(questionId, surveyId);
      alert("Question deleted successfully!");
      loadQuestions();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete question",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteAllQuestions() {
    if (
      !confirm(
        "Are you sure you want to delete ALL questions? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await surveyService.removeAllSurveyQuestions(surveyId);
      alert("All questions deleted successfully!");
      setQuestions([]);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete questions",
      );
    }
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
            Loading questions...
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
            Failed to load questions
          </p>
          <p
            style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}
          >
            {error}
          </p>
          <button
            onClick={loadQuestions}
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

  const nextOrder =
    questions.length > 0 ? Math.max(...questions.map((q) => q.order)) + 1 : 1;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)",
            }}
          >
            <svg
              width="26"
              height="26"
              fill="none"
              stroke="white"
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
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Survey Questions
            </h1>
            <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>
              {questions.length}{" "}
              {questions.length === 1 ? "question" : "questions"} in this survey
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {questions.length > 0 && (
            <button
              onClick={handleDeleteAllQuestions}
              style={{
                padding: "10px 18px",
                backgroundColor: "white",
                color: "#dc2626",
                borderRadius: "10px",
                border: "1px solid #fecaca",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
                e.currentTarget.style.borderColor = "#fca5a5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.borderColor = "#fecaca";
              }}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete All
            </button>
          )}
          <button
            onClick={handleAddQuestion}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
            }}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0",
            padding: "64px 48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#f1f5f9",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="#94a3b8"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              fontSize: "18px",
              color: "#0f172a",
            }}
          >
            No questions yet
          </p>
          <p
            style={{
              color: "#64748b",
              marginBottom: "24px",
              fontSize: "15px",
              maxWidth: "320px",
              margin: "0 auto 24px",
            }}
          >
            Add your first question to start building your survey
          </p>
          <button
            onClick={handleAddQuestion}
            style={{
              padding: "12px 28px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "15px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
            }}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add First Question
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {questions.map((question, index) => (
            <div
              key={question.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fafbfc",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      ...getQuestionTypeStyles(question.type),
                    }}
                  >
                    {getQuestionTypeIcon(question.type)}
                    {getQuestionTypeName(question.type)}
                  </span>
                  {question.isMandatory && (
                    <span
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: 600,
                        borderRadius: "8px",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                      }}
                    >
                      Required
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditQuestion(question)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "white",
                      color: "#475569",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.borderColor = "#e2e8f0";
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deletingId === question.id}
                    style={{
                      padding: "8px 14px",
                      backgroundColor: "white",
                      color: "#dc2626",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      cursor:
                        deletingId === question.id ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: deletingId === question.id ? 0.6 : 1,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== question.id) {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                        e.currentTarget.style.borderColor = "#fca5a5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.borderColor = "#fecaca";
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
                    {deletingId === question.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div style={{ padding: "20px 24px" }}>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    marginBottom: "0",
                    color: "#0f172a",
                    lineHeight: 1.5,
                  }}
                >
                  {question.questionText}
                </p>

                {question.questionOptions &&
                  question.questionOptions.length > 0 && (
                    <div style={{ marginTop: "16px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          marginBottom: "10px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Answer Options
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {[...question.questionOptions]
                          .sort((a, b) => a.order - b.order)
                          .map((option) => (
                            <span
                              key={option.id}
                              style={{
                                padding: "8px 14px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "8px",
                                fontSize: "13px",
                                color: "#475569",
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: "#e2e8f0",
                                  borderRadius: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  color: "#64748b",
                                }}
                              >
                                {option.order}
                              </span>
                              {option.value}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddQuestionForm
          surveyId={surveyId}
          nextOrder={nextOrder}
          onClose={() => setShowAddForm(false)}
          onAdded={handleQuestionAdded}
        />
      )}

      {editingQuestion && (
        <EditQuestionForm
          surveyId={surveyId}
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onUpdated={handleQuestionUpdated}
        />
      )}
    </div>
  );
}
