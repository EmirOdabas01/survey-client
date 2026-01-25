"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { UserSurveyCard } from "./user-survey-card";
import { CreateSurveyForm } from "./create-survey-form";
import type { UserSurvey } from "@/shared/types/survey.types";

export function UserSurveyList() {
  const [surveys, setSurveys] = useState<UserSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  async function loadSurveys() {
    setLoading(true);
    setError(null);
    try {
      const response = await surveyService.getUserSurveys();
      setSurveys(response.surveys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }

  function handlePublish(surveyId: string) {
    alert(`Publish survey: ${surveyId}\n\nEndpoint will be implemented soon.`);
  }

  function handleClose(surveyId: string) {
    alert(`Close survey: ${surveyId}\n\nEndpoint will be implemented soon.`);
  }

  function handleAnalyze(surveyId: string) {
    alert(`Analyze survey: ${surveyId}\n\nEndpoint will be implemented soon.`);
  }

  function handleUpdate(survey: UserSurvey) {
    alert(
      `Update survey: ${survey.name}\n\nEndpoint will be implemented soon.`,
    );
  }

  function handleDelete(surveyId: string) {
    if (confirm("Are you sure you want to delete this survey?")) {
      alert(`Delete survey: ${surveyId}\n\nEndpoint will be implemented soon.`);
    }
  }

  function handleUploadImage(surveyId: string) {
    alert(
      `Upload image for survey: ${surveyId}\n\nEndpoint will be implemented soon.`,
    );
  }

  function handleRemoveImage(surveyId: string) {
    if (confirm("Are you sure you want to remove this image?")) {
      alert(
        `Remove image for survey: ${surveyId}\n\nEndpoint will be implemented soon.`,
      );
    }
  }

  function handleViewQuestions(surveyId: string) {
    alert(
      `View questions for survey: ${surveyId}\n\nEndpoint will be implemented soon.`,
    );
  }

  function handleSurveyCreated() {
    loadSurveys();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your surveys...</p>
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
            Failed to load surveys
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadSurveys}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
          <p className="text-gray-600 mt-1">
            {surveys.length} {surveys.length === 1 ? "survey" : "surveys"}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Survey
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 350px))",
          gap: "24px",
          justifyContent: "start",
        }}
      >
        {surveys.map((survey) => (
          <UserSurveyCard
            key={survey.id}
            survey={survey}
            onPublish={handlePublish}
            onClose={handleClose}
            onAnalyze={handleAnalyze}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onUploadImage={handleUploadImage}
            onRemoveImage={handleRemoveImage}
            onViewQuestions={handleViewQuestions}
          />
        ))}
      </div>

      {showCreateForm && (
        <CreateSurveyForm
          onClose={() => setShowCreateForm(false)}
          onCreated={handleSurveyCreated}
        />
      )}
    </div>
  );
}
