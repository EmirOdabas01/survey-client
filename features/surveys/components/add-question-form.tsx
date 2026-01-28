"use client";

import { useState } from "react";
import { surveyService } from "../services/survey.service";
import { QuestionType } from "@/shared/types/survey.types";
import { ApiValidationError } from "@/shared/api/api-client";

interface AddQuestionFormProps {
  surveyId: string;
  nextOrder: number;
  onClose: () => void;
  onAdded: () => void;
}

interface QuestionOption {
  order: number;
  value: string;
}

export function AddQuestionForm({
  surveyId,
  nextOrder,
  onClose,
  onAdded,
}: AddQuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.Open,
  );
  const [isMandatory, setIsMandatory] = useState(false);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsOptions =
    questionType === QuestionType.Dropdown ||
    questionType === QuestionType.MultipleChoice ||
    questionType === QuestionType.Logical;

  function handleAddOption() {
    if (!newOptionValue.trim()) return;

    setOptions((prev) => [
      ...prev,
      { order: prev.length + 1, value: newOptionValue.trim() },
    ]);
    setNewOptionValue("");
  }

  function handleRemoveOption(index: number) {
    setOptions((prev) => {
      const newOptions = prev.filter((_, i) => i !== index);
      return newOptions.map((opt, i) => ({ ...opt, order: i + 1 }));
    });
  }

  function handleTypeChange(type: QuestionType) {
    setQuestionType(type);

    if (type === QuestionType.Logical) {
      setOptions([
        { order: 1, value: "True" },
        { order: 2, value: "False" },
      ]);
    } else if (questionType === QuestionType.Logical) {
      setOptions([]);
    }
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
      await surveyService.createSurveyQuestions(surveyId, [
        {
          order: nextOrder,
          questionText: questionText.trim(),
          isMandatory,
          questionType,
          questionOptions: needsOptions ? options : [],
        },
      ]);
      alert("Question added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Failed to add question");
      }
    } finally {
      setLoading(false);
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
            <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
              Add New Question
            </h2>
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
          <form id="add-question-form" onSubmit={handleSubmit}>
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
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                Question Type *
              </label>
              <select
                value={questionType}
                onChange={(e) =>
                  handleTypeChange(Number(e.target.value) as QuestionType)
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                }}
              >
                <option value={QuestionType.Open}>Open Text</option>
                <option value={QuestionType.Dropdown}>Dropdown</option>
                <option value={QuestionType.MultipleChoice}>
                  Multiple Choice
                </option>
                <option value={QuestionType.Logical}>True/False</option>
              </select>
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
                    {options.map((option, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "6px",
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
                        <span style={{ flex: 1, fontSize: "14px" }}>
                          {option.value}
                        </span>
                        {questionType !== QuestionType.Logical && (
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {questionType !== QuestionType.Logical && (
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
            form="add-question-form"
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
            {loading ? "Adding..." : "Add Question"}
          </button>
        </div>
      </div>
    </>
  );
}
