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

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
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
          style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
                Edit Question
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  margin: "4px 0 0 0",
                }}
              >
                Type: {getQuestionTypeName(question.type)} (cannot be changed)
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <form id="edit-question-form" onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                Question Text *
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question"
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  style={{ width: "16px", height: "16px" }}
                />
                <span style={{ fontSize: "14px" }}>Required question</span>
              </label>
            </div>

            {needsOptions && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "8px",
                  }}
                >
                  Options *
                </label>

                {options.length > 0 && (
                  <div
                    style={{
                      marginBottom: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
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
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "24px",
                              height: "24px",
                              backgroundColor: "#2563eb",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
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
                              flex: 1,
                              padding: "8px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              fontSize: "14px",
                              boxSizing: "border-box",
                            }}
                          />
                          {question.type !== QuestionType.Logical && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#dc2626",
                                padding: "4px",
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
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      placeholder="Enter option value"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
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
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
