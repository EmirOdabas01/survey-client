"use client";

import type { Question } from "@/shared/types/survey.types";

interface LogicalQuestionProps {
  question: Question;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export function LogicalQuestion({
  question,
  value,
  onChange,
}: LogicalQuestionProps) {
  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <button
        type="button"
        onClick={() => onChange(true)}
        style={{
          flex: 1,
          padding: "18px 24px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: value === true ? "#16a34a" : "#ffffff",
          color: value === true ? "#ffffff" : "#334155",
          border: value === true ? "2px solid #16a34a" : "1px solid #e2e8f0",
          boxShadow:
            value === true ? "0 4px 12px rgba(22, 163, 74, 0.3)" : "none",
        }}
        onMouseEnter={(e) => {
          if (value !== true) {
            e.currentTarget.style.backgroundColor = "#f0fdf4";
            e.currentTarget.style.borderColor = "#86efac";
            e.currentTarget.style.color = "#16a34a";
          }
        }}
        onMouseLeave={(e) => {
          if (value !== true) {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#334155";
          }
        }}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        True
      </button>

      <button
        type="button"
        onClick={() => onChange(false)}
        style={{
          flex: 1,
          padding: "18px 24px",
          borderRadius: "12px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          backgroundColor: value === false ? "#dc2626" : "#ffffff",
          color: value === false ? "#ffffff" : "#334155",
          border: value === false ? "2px solid #dc2626" : "1px solid #e2e8f0",
          boxShadow:
            value === false ? "0 4px 12px rgba(220, 38, 38, 0.3)" : "none",
        }}
        onMouseEnter={(e) => {
          if (value !== false) {
            e.currentTarget.style.backgroundColor = "#fef2f2";
            e.currentTarget.style.borderColor = "#fca5a5";
            e.currentTarget.style.color = "#dc2626";
          }
        }}
        onMouseLeave={(e) => {
          if (value !== false) {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#334155";
          }
        }}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        False
      </button>
    </div>
  );
}
