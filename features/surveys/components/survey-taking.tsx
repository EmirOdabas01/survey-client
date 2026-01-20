"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { surveyService } from "../services/survey.service";
import { QuestionCard } from "./questions/question-card";
import type { Question, QuestionAnswer } from "@/shared/types/survey.types";
import { QuestionType } from "@/shared/types/survey.types";

interface AnswerState {
  textAnswer: string;
  selectedOptionId: number | null;
  selectedOptionIds: number[];
  logicalAnswer: boolean | null;
}

interface SurveyTakingProps {
  surveyId: string;
  responseId: number;
}

export function SurveyTaking({ surveyId, responseId }: SurveyTakingProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [surveyId]);

  async function loadQuestions() {
    setLoading(true);
    setError(null);
    try {
      const response = await surveyService.getSurveyQuestions(surveyId);

      const sortedQuestions = [...response.questions].sort(
        (a, b) => a.order - b.order
      );
      setQuestions(sortedQuestions);

      const initialAnswers: Record<number, AnswerState> = {};
      sortedQuestions.forEach((q) => {
        initialAnswers[q.id] = {
          textAnswer: "",
          selectedOptionId: null,
          selectedOptionIds: [],
          logicalAnswer: null,
        };
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswerChange(questionId: number, answer: AnswerState) {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }

  function validateAnswers(): boolean {
    const newErrors: Record<number, string> = {};

    questions.forEach((question) => {
      if (question.isMandatory) {
        const answer = answers[question.id];
        let isAnswered = false;

        switch (question.type) {
          case QuestionType.Open:
            isAnswered = answer.textAnswer.trim() !== "";
            break;
          case QuestionType.Dropdown:
            isAnswered = answer.selectedOptionId !== null;
            break;
          case QuestionType.MultipleChoice:
            isAnswered = answer.selectedOptionIds.length > 0;
            break;
          case QuestionType.Logical:
            isAnswered = answer.logicalAnswer !== null;
            break;
        }

        if (!isAnswered) {
          newErrors[question.id] = "This question is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatAnswersForSubmission(): QuestionAnswer[] {
    return questions.map((question) => {
      const answer = answers[question.id];

      switch (question.type) {
        case QuestionType.Open:
          return {
            questionId: question.id,
            questionAnswer: answer.textAnswer || null,
            questionOptionsIds: null,
          };

        case QuestionType.Dropdown:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds: answer.selectedOptionId
              ? [answer.selectedOptionId]
              : null,
          };

        case QuestionType.MultipleChoice:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds:
              answer.selectedOptionIds.length > 0
                ? answer.selectedOptionIds
                : null,
          };

        case QuestionType.Logical:
          if (answer.logicalAnswer === null) {
            return {
              questionId: question.id,
              questionAnswer: null,
              questionOptionsIds: null,
            };
          }
          if (question.questionOptions.length >= 2) {
            const sortedOptions = [...question.questionOptions].sort(
              (a, b) => a.order - b.order
            );
            const optionId = answer.logicalAnswer
              ? sortedOptions[0].id
              : sortedOptions[1].id;
            return {
              questionId: question.id,
              questionAnswer: null,
              questionOptionsIds: [optionId],
            };
          }
          return {
            questionId: question.id,
            questionAnswer: answer.logicalAnswer ? "true" : "false",
            questionOptionsIds: null,
          };

        default:
          return {
            questionId: question.id,
            questionAnswer: null,
            questionOptionsIds: null,
          };
      }
    });
  }

  async function handleSubmit() {
    if (!validateAnswers()) {
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        const element = document.getElementById(`question-${firstErrorId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = formatAnswersForSubmission();
      await surveyService.submitAnswers({
        responseId,
        answers: formattedAnswers,
      });

      alert("Your answers have been submitted successfully!");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">
            Failed to load questions
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadQuestions}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} id={`question-${question.id}`}>
            <QuestionCard
              question={question}
              questionNumber={index + 1}
              answer={answers[question.id]}
              onAnswerChange={(answer) =>
                handleAnswerChange(question.id, answer)
              }
              error={errors[question.id]}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 pb-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>

        {Object.keys(errors).length > 0 && (
          <p className="mt-4 text-center text-red-600">
            Please answer all required questions before submitting.
          </p>
        )}
      </div>
    </div>
  );
}
