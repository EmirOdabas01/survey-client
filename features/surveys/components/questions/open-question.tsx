"use client";

import { useState } from "react";
import type { Question } from "@/shared/types/survey.types";

interface OpenQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function OpenQuestion({ question, value, onChange }: OpenQuestionProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type your answer here..."
        rows={4}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "15px",
          lineHeight: 1.6,
          border: isFocused ? "2px solid #2563eb" : "1px solid #e2e8f0",
          borderRadius: "12px",
          backgroundColor: isFocused ? "#ffffff" : "#f8fafc",
          transition: "all 0.2s ease",
          outline: "none",
          resize: "vertical",
          minHeight: "120px",
          boxSizing: "border-box",
          boxShadow: isFocused ? "0 0 0 4px rgba(37, 99, 235, 0.1)" : "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          {value.length} characters
        </span>
      </div>
    </div>
  );
}
