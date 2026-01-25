"use client";

import { useState } from "react";
import { surveyService } from "../services/survey.service";
import { SurveyVisibility } from "@/shared/types/survey.types";
import { ApiValidationError } from "@/shared/api/api-client";

interface CreateSurveyFormProps {
  onClose: () => void;
  onCreated: () => void;
}

function getDefaultStartDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now.toISOString().slice(0, 16);
}

export function CreateSurveyForm({
  onClose,
  onCreated,
}: CreateSurveyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: getDefaultStartDate(),
    endDate: "",
    minResponse: 1,
    maxResponse: 100,
    visibility: SurveyVisibility.Public,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "minResponse" ||
        name === "maxResponse" ||
        name === "visibility"
          ? Number(value)
          : value,
    }));

    if (fieldErrors[name.toLowerCase()]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name.toLowerCase()];
        return newErrors;
      });
    }
  }

  function getFieldError(fieldName: string): string | null {
    const errors = fieldErrors[fieldName.toLowerCase()];
    return errors && errors.length > 0 ? errors[0] : null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!formData.name.trim()) {
      setFieldErrors({ name: ["Survey name is required"] });
      return;
    }
    if (!formData.description.trim()) {
      setFieldErrors({ description: ["Description is required"] });
      return;
    }
    if (!formData.startDate) {
      setFieldErrors({ startdate: ["Start date is required"] });
      return;
    }

    setLoading(true);
    try {
      await surveyService.createSurvey({
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        minResponse: formData.minResponse,
        maxResponse: formData.maxResponse,
        visibility: formData.visibility,
      });
      alert("Survey created successfully!");
      onCreated();
      onClose();
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setFieldErrors(err.getFieldErrors());
        setError("Please fix the errors below");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to create survey",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
        }}
      >
        {/* Header */}
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
              Create New Survey
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <form id="create-survey-form" onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                Survey Name *
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="5-20 characters"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${getFieldError("name") ? "#dc2626" : "#d1d5db"}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
              {getFieldError("name") && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {getFieldError("name")}
                </p>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="10-100 characters"
                rows={2}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${getFieldError("description") ? "#dc2626" : "#d1d5db"}`,
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />
              {getFieldError("description") && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {getFieldError("description")}
                </p>
              )}
            </div>

            {/* Visibility */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                Visibility *
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  boxSizing: "border-box",
                }}
              >
                <option value={SurveyVisibility.Public}>Public</option>
                <option value={SurveyVisibility.Group}>Group</option>
                <option value={SurveyVisibility.Private}>Private</option>
              </select>
            </div>

            {/* Dates Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  Start Date *
                </label>
                <input
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${getFieldError("startdate") ? "#dc2626" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {getFieldError("startdate") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {getFieldError("startdate")}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  End Date
                </label>
                <input
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${getFieldError("enddate") ? "#dc2626" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {getFieldError("enddate") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {getFieldError("enddate")}
                  </p>
                )}
              </div>
            </div>

            {/* Response Limits Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  Min Responses *
                </label>
                <input
                  name="minResponse"
                  type="number"
                  min="1"
                  value={formData.minResponse}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${getFieldError("minresponse") ? "#dc2626" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {getFieldError("minresponse") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {getFieldError("minresponse")}
                  </p>
                )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  Max Responses *
                </label>
                <input
                  name="maxResponse"
                  type="number"
                  min="1"
                  value={formData.maxResponse}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${getFieldError("maxresponse") ? "#dc2626" : "#d1d5db"}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
                {getFieldError("maxresponse") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    {getFieldError("maxresponse")}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-survey-form"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Survey"}
          </button>
        </div>
      </div>
    </>
  );
}
