"use client";

import type { Question } from "@/shared/types/survey.types";

interface MultipleChoiceQuestionProps {
  question: Question;
  values: number[];
  onChange: (optionIds: number[]) => void;
}

export function MultipleChoiceQuestion({
  question,
  values,
  onChange,
}: MultipleChoiceQuestionProps) {
  const sortedOptions = [...question.questionOptions].sort(
    (a, b) => a.order - b.order,
  );

  function handleCheckboxChange(optionId: number, checked: boolean) {
    if (checked) {
      onChange([...values, optionId]);
    } else {
      onChange(values.filter((id) => id !== optionId));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {sortedOptions.map((option) => {
        const isSelected = values.includes(option.id);
        return (
          <label
            key={option.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
              borderRadius: "12px",
              cursor: "pointer",
              backgroundColor: isSelected ? "#eff6ff" : "#ffffff",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }
            }}
          >
            <div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "6px",
                border: isSelected ? "2px solid #2563eb" : "2px solid #cbd5e1",
                backgroundColor: isSelected ? "#2563eb" : "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) =>
                handleCheckboxChange(option.id, e.target.checked)
              }
              style={{ display: "none" }}
            />
            <span
              style={{
                marginLeft: "14px",
                fontSize: "15px",
                color: isSelected ? "#1e40af" : "#334155",
                fontWeight: isSelected ? 500 : 400,
              }}
            >
              {option.value}
            </span>
          </label>
        );
      })}
      <p
        style={{
          fontSize: "13px",
          color: "#94a3b8",
          margin: "4px 0 0 0",
        }}
      >
        Select all that apply
      </p>
    </div>
  );
}
