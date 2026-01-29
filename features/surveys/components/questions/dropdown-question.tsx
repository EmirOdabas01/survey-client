"use client";

import { useState } from "react";
import type { Question } from "@/shared/types/survey.types";

interface DropdownQuestionProps {
  question: Question;
  value: number | null;
  onChange: (optionId: number | null) => void;
}

export function DropdownQuestion({
  question,
  value,
  onChange,
}: DropdownQuestionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const sortedOptions = [...question.questionOptions].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div style={{ position: "relative" }}>
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          padding: "16px",
          paddingRight: "48px",
          fontSize: "15px",
          border: isFocused ? "2px solid #2563eb" : "1px solid #e2e8f0",
          borderRadius: "12px",
          backgroundColor: isFocused ? "#ffffff" : "#f8fafc",
          transition: "all 0.2s ease",
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          boxShadow: isFocused ? "0 0 0 4px rgba(37, 99, 235, 0.1)" : "none",
          color: value ? "#0f172a" : "#94a3b8",
        }}
      >
        <option value="">Select an option...</option>
        {sortedOptions.map((option) => (
          <option
            key={option.id}
            value={option.id}
            style={{ color: "#0f172a" }}
          >
            {option.value}
          </option>
        ))}
      </select>

      <div
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="#64748b"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
