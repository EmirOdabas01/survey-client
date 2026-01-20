"use client";

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
  const sortedOptions = [...question.questionOptions].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div>
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="">Select an option...</option>
        {sortedOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
}
