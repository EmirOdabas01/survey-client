"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { surveyService } from "../services/survey.service";
import { UserSurveyCard } from "./user-survey-card";
import { CreateSurveyForm } from "./create-survey-form";
import { UpdateSurveyForm } from "./update-survey-form";
import { UploadImageModal } from "./upload-image-modal";
import type { UserSurvey } from "@/shared/types/survey.types";

export function UserSurveyList() {
  const router = useRouter();
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
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to close survey");
    }
  }

  function handleAnalyze(surveyId: string) {
    router.push(`/dashboard/surveys/${surveyId}/analysis`);
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
    if (survey) setUploadingSurvey(survey);
  }

  async function handleRemoveImage(surveyId: string) {
    if (!confirm("Are you sure you want to remove this image?")) return;
    try {
      const imageData = await surveyService.getSurveyImage(surveyId);
      if (!imageData?.id) {
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
    router.push(`/dashboard/surveys/${surveyId}/questions`);
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "15px" }}>
            Loading your surveys...
          </p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#fef2f2",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#dc2626"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            style={{
              fontWeight: 600,
              marginBottom: "8px",
              color: "#0f172a",
              fontSize: "17px",
            }}
          >
            Failed to load surveys
          </p>
          <p
            style={{ color: "#64748b", marginBottom: "24px", fontSize: "15px" }}
          >
            {error}
          </p>
          <button
            onClick={loadSurveys}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px 0",
            }}
          >
            My Surveys
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
            {surveys.length} {surveys.length === 1 ? "survey" : "surveys"} total
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s ease",
            boxShadow: "0 1px 3px rgba(37, 99, 235, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Survey
        </button>
      </div>

      {surveys.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "64px 32px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              backgroundColor: "#f1f5f9",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg
              width="36"
              height="36"
              fill="none"
              stroke="#94a3b8"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 8px 0",
            }}
          >
            No surveys yet
          </h3>
          <p
            style={{
              color: "#64748b",
              marginBottom: "24px",
              fontSize: "15px",
            }}
          >
            Create your first survey to get started
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: "12px 28px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Create Your First Survey
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
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
          onCreated={() => {
            loadSurveys();
          }}
        />
      )}
      {editingSurvey && (
        <UpdateSurveyForm
          survey={editingSurvey}
          onClose={() => setEditingSurvey(null)}
          onUpdated={() => {
            loadSurveys();
          }}
        />
      )}
      {uploadingSurvey && (
        <UploadImageModal
          surveyId={uploadingSurvey.id}
          surveyName={uploadingSurvey.name}
          onClose={() => setUploadingSurvey(null)}
          onUploaded={() => {
            loadSurveys();
          }}
        />
      )}
    </div>
  );
}
