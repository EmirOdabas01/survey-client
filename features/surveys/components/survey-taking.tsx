"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { surveyService } from "../services/survey.service";
import { QuestionCard } from "./questions/question-card";
import type { Question, QuestionAnswer } from "@/shared/types/survey.types";
import { QuestionType } from "@/shared/types/survey.types";

interface AnswerState {
  textAnswer: string;
  selectedOptionId: number | null;
  selectedOptionIds: number[];
  logicalAnswer: boolean | null;
}

interface SurveyTakingProps {
  surveyId: string;
  responseId: number;
}

export function SurveyTaking({ surveyId, responseId }: SurveyTakingProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

      const initialAnswers: Record<number, AnswerState> = {};
      sortedQuestions.forEach((q) => {
        initialAnswers[q.id] = {
          textAnswer: "",
          selectedOptionId: null,
          selectedOptionIds: [],
          logicalAnswer: null,
        };
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerChange(questionId: number, answer: AnswerState) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }

  function validateAnswers(): boolean {
    const newErrors: Record<number, string> = {};

    questions.forEach((question) => {
      if (question.isMandatory) {
        const answer = answers[question.id];
        let isAnswered = false;

        switch (question.type) {
          case QuestionType.Open:
            isAnswered = answer.textAnswer.trim() !== "";
            break;
          case QuestionType.Dropdown:
            isAnswered = answer.selectedOptionId !== null;
            break;
          case QuestionType.MultipleChoice:
            isAnswered = answer.selectedOptionIds.length > 0;
            break;
          case QuestionType.Logical:
            isAnswered = answer.logicalAnswer !== null;
            break;
        }

        if (!isAnswered) {
          newErrors[question.id] = "This question is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatAnswersForSubmission(): QuestionAnswer[] {
    return questions.map((question) => {
      const answer = answers[question.id];

      switch (question.type) {
        case QuestionType.Open:
          return {
            questionId: question.id,
            questionAnswer: answer.textAnswer || null,
            questionOptionsIds: null,
          };

        case QuestionType.Dropdown:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds: answer.selectedOptionId
              ? [answer.selectedOptionId]
              : null,
          };

        case QuestionType.MultipleChoice:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds:
              answer.selectedOptionIds.length > 0
                ? answer.selectedOptionIds
                : null,
          };

        case QuestionType.Logical:
          if (answer.logicalAnswer === null) {
            return {
              questionId: question.id,
              questionAnswer: null,
              questionOptionsIds: null,
            };
          }
          if (question.questionOptions.length >= 2) {
            const sortedOptions = [...question.questionOptions].sort(
              (a, b) => a.order - b.order,
            );
            const optionId = answer.logicalAnswer
              ? sortedOptions[0].id
              : sortedOptions[1].id;
            return {
              questionId: question.id,
              questionAnswer: null,
              questionOptionsIds: [optionId],
            };
          }
          return {
            questionId: question.id,
            questionAnswer: answer.logicalAnswer ? "true" : "false",
            questionOptionsIds: null,
          };

        default:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds: null,
          };
      }
    });
  }

  async function handleSubmit() {
    if (!validateAnswers()) {
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        const element = document.getElementById(`question-${firstErrorId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = formatAnswersForSubmission();
      await surveyService.submitAnswers({
        responseId,
        answers: formattedAnswers,
      });

      alert("Your answers have been submitted successfully!");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  }

  const answeredCount = questions.filter((q) => {
    const answer = answers[q.id];
    if (!answer) return false;
    switch (q.type) {
      case QuestionType.Open:
        return answer.textAnswer.trim() !== "";
      case QuestionType.Dropdown:
        return answer.selectedOptionId !== null;
      case QuestionType.MultipleChoice:
        return answer.selectedOptionIds.length > 0;
      case QuestionType.Logical:
        return answer.logicalAnswer !== null;
      default:
        return false;
    }
  }).length;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

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
            Loading questions...
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
            Failed to load questions
          </p>
          <p
            style={{ color: "#64748b", marginBottom: "24px", fontSize: "15px" }}
          >
            {error}
          </p>
          <button
            onClick={loadQuestions}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>
            Progress
          </span>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            {answeredCount} of {questions.length} answered
          </span>
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
              width: `${progress}%`,
              backgroundColor: progress === 100 ? "#16a34a" : "#2563eb",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {questions.map((question, index) => (
          <div key={question.id} id={`question-${question.id}`}>
            <QuestionCard
              question={question}
              questionNumber={index + 1}
              answer={answers[question.id]}
              onAnswerChange={(answer) =>
                handleAnswerChange(question.id, answer)
              }
              error={errors[question.id]}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "32px",
          paddingBottom: "40px",
        }}
      >
        {Object.keys(errors).length > 0 && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "20px",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#dc2626"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
              Please answer all required questions before submitting.
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "18px 32px",
            backgroundColor: submitting ? "#93c5fd" : "#2563eb",
            color: "white",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "12px",
            border: "none",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.currentTarget.style.backgroundColor = "#1d4ed8";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(37, 99, 235, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting) {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(37, 99, 235, 0.3)";
            }
          }}
        >
          {submitting ? (
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
              Submitting...
            </>
          ) : (
            <>
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Submit Answers
            </>
          )}
        </button>
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
