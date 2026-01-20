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
  // Sort options by order
  const sortedOptions = [...question.questionOptions].sort(
    (a, b) => a.order - b.order
  );

  function handleCheckboxChange(optionId: number, checked: boolean) {
    if (checked) {
      onChange([...values, optionId]);
    } else {
      onChange(values.filter((id) => id !== optionId));
    }
  }

  return (
    <div className="space-y-3">
      {sortedOptions.map((option) => (
        <label
          key={option.id}
          className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={values.includes(option.id)}
            onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-3 text-gray-700">{option.value}</span>
        </label>
      ))}
    </div>
  );
}
