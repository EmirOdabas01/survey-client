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
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
          value === true
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        True
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-3 px-6 rounded-md font-medium transition-colors ${
          value === false
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        False
      </button>
    </div>
  );
}
