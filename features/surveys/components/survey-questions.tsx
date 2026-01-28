"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { QuestionType } from "@/shared/types/survey.types";
import type { Question } from "@/shared/types/survey.types";

interface SurveyQuestionsProps {
  surveyId: string;
}

export function SurveyQuestions({ surveyId }: SurveyQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        return "Open Text";
      case QuestionType.Dropdown:
        return "Dropdown";
      case QuestionType.MultipleChoice:
        return "Multiple Choice";
      case QuestionType.Logical:
        return "True/False";
      default:
        return "Unknown";
    }
  }

  function getQuestionTypeColor(type: QuestionType): React.CSSProperties {
    switch (type) {
      case QuestionType.Open:
        return {
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #3b82f6",
        };
      case QuestionType.Dropdown:
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #f59e0b",
        };
      case QuestionType.MultipleChoice:
        return {
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #10b981",
        };
      case QuestionType.Logical:
        return {
          backgroundColor: "#f3e8ff",
          color: "#6b21a8",
          border: "1px solid #a855f7",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #9ca3af",
        };
    }
  }

  function handleAddQuestion() {
    alert(
      "Add question - will be implemented with CreateSurveyQuestions endpoint",
    );
  }

  function handleEditQuestion(question: Question) {
    alert(
      `Edit question: ${question.questionText}\n\nWill be implemented with UpdateSurveyQuestions endpoint`,
    );
  }

  function handleDeleteQuestion(questionId: number) {
    if (confirm("Are you sure you want to delete this question?")) {
      alert(
        `Delete question: ${questionId}\n\nWill be implemented with RemoveSingleQuestion endpoint`,
      );
    }
  }

  function handleDeleteAllQuestions() {
    if (
      confirm(
        "Are you sure you want to delete ALL questions? This action cannot be undone.",
      )
    ) {
      alert(
        "Delete all questions - will be implemented with RemoveSurveyQuestions endpoint",
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
            Loading questions...
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
            Failed to load questions
          </p>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>{error}</p>
          <button
            onClick={loadQuestions}
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Survey Questions
          </h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>
            {questions.length}{" "}
            {questions.length === 1 ? "question" : "questions"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          {questions.length > 0 && (
            <button
              onClick={handleDeleteAllQuestions}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Delete All
            </button>
          )}
          <button
            onClick={handleAddQuestion}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Add Question
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            padding: "48px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#9ca3af", marginBottom: "16px" }}>
            <svg
              style={{ width: "64px", height: "64px", margin: "0 auto" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p style={{ fontWeight: 500, marginBottom: "8px" }}>
            No questions yet
          </p>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            Add your first question to get started
          </p>
          <button
            onClick={handleAddQuestion}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
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
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "9999px",
                      ...getQuestionTypeColor(question.type),
                    }}
                  >
                    {getQuestionTypeName(question.type)}
                  </span>
                  {question.isMandatory && (
                    <span
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 500,
                        borderRadius: "9999px",
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        border: "1px solid #fca5a5",
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
                      padding: "6px 12px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ padding: "16px 20px" }}>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    marginBottom: "12px",
                  }}
                >
                  {question.questionText}
                </p>

                {question.questionOptions &&
                  question.questionOptions.length > 0 && (
                    <div style={{ marginTop: "12px" }}>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: "8px",
                        }}
                      >
                        Options:
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
                                padding: "6px 12px",
                                backgroundColor: "#f3f4f6",
                                borderRadius: "6px",
                                fontSize: "13px",
                                color: "#374151",
                              }}
                            >
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
    </div>
  );
}
