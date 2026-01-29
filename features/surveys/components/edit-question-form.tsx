"use client";

import { useState } from "react";
import { surveyService } from "../services/survey.service";
import { QuestionType } from "@/shared/types/survey.types";
import { ApiValidationError } from "@/shared/api/api-client";
import type {
  Question,
  UpdateQuestionOptionRequest,
} from "@/shared/types/survey.types";

interface EditQuestionFormProps {
  surveyId: string;
  question: Question;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditQuestionForm({
  surveyId,
  question,
  onClose,
  onUpdated,
}: EditQuestionFormProps) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [isMandatory, setIsMandatory] = useState(question.isMandatory);
  const [options, setOptions] = useState<UpdateQuestionOptionRequest[]>(
    question.questionOptions.map((opt) => ({
      id: opt.id,
      order: opt.order,
      value: opt.value,
    })),
  );
  const [newOptionValue, setNewOptionValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nextNewOptionId, setNextNewOptionId] = useState(-1);

  const needsOptions =
    question.type === QuestionType.Dropdown ||
    question.type === QuestionType.MultipleChoice ||
    question.type === QuestionType.Logical;

  function handleAddOption() {
    if (!newOptionValue.trim()) return;

    setOptions((prev) => [
      ...prev,
      {
        id: nextNewOptionId,
        order: prev.length + 1,
        value: newOptionValue.trim(),
      },
    ]);
    setNextNewOptionId((prev) => prev - 1);
    setNewOptionValue("");
  }

  function handleRemoveOption(index: number) {
    setOptions((prev) => {
      const newOptions = prev.filter((_, i) => i !== index);
      return newOptions.map((opt, i) => ({ ...opt, order: i + 1 }));
    });
  }

  function handleOptionValueChange(index: number, value: string) {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, value } : opt)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!questionText.trim()) {
      setError("Question text is required");
      return;
    }

    if (needsOptions && options.length < 2) {
      setError("Please add at least 2 options");
      return;
    }

    setLoading(true);
    try {
      const preparedOptions = options.map((opt) => ({
        id: opt.id < 0 ? 0 : opt.id,
        order: opt.order,
        value: opt.value,
      }));

      await surveyService.updateSurveyQuestions(surveyId, [
        {
          id: question.id,
          order: question.order,
          questionText: questionText.trim(),
          isMandatory,
          questionOptions: needsOptions ? preparedOptions : [],
        },
      ]);
      alert("Question updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setError(err.message);
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to update question",
        );
      }
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
        return "True/False";
      default:
        return "Unknown";
    }
  }

  function getQuestionTypeStyles(type: QuestionType): React.CSSProperties {
    switch (type) {
      case QuestionType.Open:
        return { backgroundColor: "#eff6ff", color: "#1d4ed8" };
      case QuestionType.Dropdown:
        return { backgroundColor: "#fef3c7", color: "#b45309" };
      case QuestionType.MultipleChoice:
        return { backgroundColor: "#dcfce7", color: "#15803d" };
      case QuestionType.Logical:
        return { backgroundColor: "#f3e8ff", color: "#7c3aed" };
      default:
        return { backgroundColor: "#f1f5f9", color: "#475569" };
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "all 0.15s ease",
    backgroundColor: "#ffffff",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
    color: "#334155",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "90%",
          maxWidth: "550px",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#fef3c7",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#d97706"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Edit Question
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    ...getQuestionTypeStyles(question.type),
                  }}
                >
                  {getQuestionTypeName(question.type)}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  (type cannot be changed)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "#64748b",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <form id="edit-question-form" onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Question Text <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "none",
                  minHeight: "100px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "14px 16px",
                  backgroundColor: isMandatory ? "#eff6ff" : "#f8fafc",
                  borderRadius: "10px",
                  border: `1px solid ${isMandatory ? "#bfdbfe" : "#e2e8f0"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "24px",
                    backgroundColor: isMandatory ? "#2563eb" : "#cbd5e1",
                    borderRadius: "12px",
                    position: "relative",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: isMandatory ? "22px" : "2px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  style={{ display: "none" }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    Required Question
                  </span>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "2px 0 0 0",
                    }}
                  >
                    Users must answer this question
                  </p>
                </div>
              </label>
            </div>

            {needsOptions && (
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>
                  Answer Options <span style={{ color: "#dc2626" }}>*</span>
                  <span
                    style={{
                      fontWeight: 400,
                      color: "#64748b",
                      marginLeft: "8px",
                    }}
                  >
                    (minimum 2)
                  </span>
                </label>

                {options.length > 0 && (
                  <div
                    style={{
                      marginBottom: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {options
                      .sort((a, b) => a.order - b.order)
                      .map((option, index) => (
                        <div
                          key={option.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              width: "28px",
                              height: "28px",
                              backgroundColor: "#2563eb",
                              color: "white",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {option.order}
                          </span>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) =>
                              handleOptionValueChange(index, e.target.value)
                            }
                            style={{
                              ...inputStyle,
                              flex: 1,
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = "#2563eb";
                              e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(37, 99, 235, 0.1)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                          {question.type !== QuestionType.Logical && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              style={{
                                padding: "10px",
                                background: "none",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                cursor: "pointer",
                                color: "#dc2626",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#fef2f2";
                                e.currentTarget.style.borderColor = "#fca5a5";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {question.type !== QuestionType.Logical && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      placeholder="Type an option and press Enter or click Add"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      style={{
                        ...inputStyle,
                        flex: 1,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2563eb";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(37, 99, 235, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      disabled={!newOptionValue.trim()}
                      style={{
                        padding: "12px 20px",
                        backgroundColor: newOptionValue.trim()
                          ? "#2563eb"
                          : "#94a3b8",
                        color: "white",
                        borderRadius: "10px",
                        border: "none",
                        cursor: newOptionValue.trim()
                          ? "pointer"
                          : "not-allowed",
                        fontSize: "14px",
                        fontWeight: 500,
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
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
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  </div>
                )}

                {question.type === QuestionType.Logical && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      fontStyle: "italic",
                      marginTop: "8px",
                    }}
                  >
                    You can edit the True/False labels above
                  </p>
                )}
              </div>
            )}
          </form>
        </div>

        <div
          style={{
            padding: "20px 28px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: "12px",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: "#334155",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-question-form"
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: loading ? "#fcd34d" : "#f59e0b",
              color: "#0f172a",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#d97706";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#f59e0b";
            }}
          >
            {loading ? (
              <>
                <svg
                  width="18"
                  height="18"
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
                Saving...
              </>
            ) : (
              <>
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
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
