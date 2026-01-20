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
        return <p className="text-red-500">Unknown question type</p>;
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border ${
        error ? "border-red-500" : "border-gray-200"
      }`}
    >
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            <span className="text-blue-600 mr-2">{questionNumber}.</span>
            {question.questionText}
          </h3>
          {question.isMandatory && (
            <span className="text-red-500 text-sm font-medium ml-2">
              *Required
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">{renderQuestionInput()}</div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
