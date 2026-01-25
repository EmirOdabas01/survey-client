"use client";

import { useState, useEffect } from "react";
import { surveyService } from "../services/survey.service";
import { UserSurveyCard } from "./user-survey-card";
import { CreateSurveyForm } from "./create-survey-form";
import { UpdateSurveyForm } from "./update-survey-form";
import { UploadImageModal } from "./upload-image-modal";
import type { UserSurvey } from "@/shared/types/survey.types";

export function UserSurveyList() {
  const [surveys, setSurveys] = useState<UserSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<UserSurvey | null>(null);
  const [uploadingSurvey, setUploadingSurvey] = useState<UserSurvey | null>(
    null,
  );

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

  async function handlePublish(surveyId: string) {
    if (
      !confirm(
        "Are you sure you want to publish this survey? It will become visible to users.",
      )
    ) {
      return;
    }

    try {
      const response = await surveyService.publishSurvey(surveyId);
      if (response.success) {
        alert("Survey published successfully!");
        loadSurveys();
      } else {
        alert("Failed to publish survey. Please try again.");
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to publish survey",
      );
    }
  }

  async function handleClose(surveyId: string) {
    if (
      !confirm(
        "Are you sure you want to close this survey? Users will no longer be able to respond.",
      )
    ) {
      return;
    }

    try {
      const response = await surveyService.closeSurvey(surveyId);
      if (response.success) {
        alert("Survey closed successfully!");
        loadSurveys();
      } else {
        alert("Failed to close survey. Please try again.");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to close survey");
    }
  }

  function handleAnalyze(surveyId: string) {
    alert(
      `Analyze survey: ${surveyId}\n\nAnalyze feature will be implemented soon.`,
    );
  }

  function handleUpdate(survey: UserSurvey) {
    setEditingSurvey(survey);
  }

  async function handleDelete(surveyId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this survey? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await surveyService.deleteSurvey(surveyId);
      alert("Survey deleted successfully!");
      setSurveys((prev) => prev.filter((s) => s.id !== surveyId));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete survey");
    }
  }

  function handleUploadImage(surveyId: string) {
    const survey = surveys.find((s) => s.id === surveyId);
    if (survey) {
      setUploadingSurvey(survey);
    }
  }

  async function handleRemoveImage(surveyId: string) {
    if (!confirm("Are you sure you want to remove this image?")) {
      return;
    }

    try {
      const imageData = await surveyService.getSurveyImage(surveyId);

      if (!imageData || !imageData.id) {
        alert("No image found for this survey");
        return;
      }

      await surveyService.removeSurveyImage(imageData.id);
      alert("Image removed successfully!");
      loadSurveys();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to remove image");
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

  function handleSurveyUpdated() {
    loadSurveys();
  }

  function handleImageUploaded() {
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

      {surveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">No surveys yet</p>
          <p className="text-gray-600 mb-4">
            Create your first survey to get started
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Survey
          </button>
        </div>
      ) : (
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
      )}

      {showCreateForm && (
        <CreateSurveyForm
          onClose={() => setShowCreateForm(false)}
          onCreated={handleSurveyCreated}
        />
      )}

      {editingSurvey && (
        <UpdateSurveyForm
          survey={editingSurvey}
          onClose={() => setEditingSurvey(null)}
          onUpdated={handleSurveyUpdated}
        />
      )}

      {uploadingSurvey && (
        <UploadImageModal
          surveyId={uploadingSurvey.id}
          surveyName={uploadingSurvey.name}
          onClose={() => setUploadingSurvey(null)}
          onUploaded={handleImageUploaded}
        />
      )}
    </div>
  );
}
