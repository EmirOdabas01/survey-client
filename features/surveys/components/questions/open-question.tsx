"use client";

import type { Question } from "@/shared/types/survey.types";

interface OpenQuestionProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function OpenQuestion({ question, value, onChange }: OpenQuestionProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
