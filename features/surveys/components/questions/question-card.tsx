"use client";

import type { Question } from "@/shared/types/survey.types";
import { QuestionType } from "@/shared/types/survey.types";
import { OpenQuestion } from "./open-question";
import { DropdownQuestion } from "./dropdown-question";
import { MultipleChoiceQuestion } from "./multiple-choice-question";
import { LogicalQuestion } from "./logical-question";

interface AnswerState {
  textAnswer: string;
  selectedOptionId: number | null;
  selectedOptionIds: number[];
  logicalAnswer: boolean | null;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer: AnswerState;
  onAnswerChange: (answer: AnswerState) => void;
  error?: string;
}

export function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  error,
}: QuestionCardProps) {
  function getQuestionTypeLabel(type: QuestionType): string {
    switch (type) {
      case QuestionType.Open:
        return "Text Answer";
      case QuestionType.Dropdown:
        return "Select One";
      case QuestionType.MultipleChoice:
        return "Multiple Choice";
      case QuestionType.Logical:
        return "True or False";
      default:
        return "";
    }
  }

  function renderQuestionInput() {
    switch (question.type) {
      case QuestionType.Open:
        return (
          <OpenQuestion
            question={question}
            value={answer.textAnswer}
            onChange={(value) =>
              onAnswerChange({ ...answer, textAnswer: value })
            }
          />
        );

      case QuestionType.Dropdown:
        return (
          <DropdownQuestion
            question={question}
            value={answer.selectedOptionId}
            onChange={(optionId) =>
              onAnswerChange({ ...answer, selectedOptionId: optionId })
            }
          />
        );

      case QuestionType.MultipleChoice:
        return (
          <MultipleChoiceQuestion
            question={question}
            values={answer.selectedOptionIds}
            onChange={(optionIds) =>
              onAnswerChange({ ...answer, selectedOptionIds: optionIds })
            }
          />
        );

      case QuestionType.Logical:
        return (
          <LogicalQuestion
            question={question}
            value={answer.logicalAnswer}
            onChange={(value) =>
              onAnswerChange({ ...answer, logicalAnswer: value })
            }
          />
        );

      default:
        return <p style={{ color: "#dc2626" }}>Unknown question type</p>;
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "28px",
        border: error ? "2px solid #fca5a5" : "1px solid #e2e8f0",
        transition: "all 0.2s ease",
        boxShadow: error
          ? "0 0 0 4px rgba(252, 165, 165, 0.2)"
          : "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {questionNumber}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {getQuestionTypeLabel(question.type)}
              </span>
            </div>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 600,
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {question.questionText}
            </h3>
          </div>
          {question.isMandatory && (
            <span
              style={{
                padding: "4px 10px",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "1px solid #fecaca",
                whiteSpace: "nowrap",
              }}
            >
              Required
            </span>
          )}
        </div>
      </div>

      <div>{renderQuestionInput()}</div>

      {error && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 14px",
            backgroundColor: "#fef2f2",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            width="16"
            height="16"
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
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
