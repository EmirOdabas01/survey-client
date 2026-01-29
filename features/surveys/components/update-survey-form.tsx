"use client";

import { useState } from "react";
import { surveyService } from "../services/survey.service";
import { SurveyVisibility } from "@/shared/types/survey.types";
import { ApiValidationError } from "@/shared/api/api-client";
import type { UserSurvey } from "@/shared/types/survey.types";

interface UpdateSurveyFormProps {
  survey: UserSurvey;
  onClose: () => void;
  onUpdated: () => void;
}

function formatDateForInput(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

function getVisibilityEnum(visibility: string): SurveyVisibility {
  switch (visibility) {
    case "Public":
      return SurveyVisibility.Public;
    case "Group":
      return SurveyVisibility.Group;
    case "Private":
      return SurveyVisibility.Private;
    default:
      return SurveyVisibility.Public;
  }
}

export function UpdateSurveyForm({
  survey,
  onClose,
  onUpdated,
}: UpdateSurveyFormProps) {
  const [formData, setFormData] = useState({
    name: survey.name,
    description: survey.description,
    startDate: formatDateForInput(survey.startDate),
    endDate: formatDateForInput(survey.endDate),
    minResponse: survey.minResponse,
    maxResponse: survey.maxResponse,
    visibility: getVisibilityEnum(survey.visibility),
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
      await surveyService.updateSurvey({
        id: survey.id,
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
      alert("Survey updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      if (err instanceof ApiValidationError) {
        setFieldErrors(err.getFieldErrors());
        setError("Please fix the errors below");
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to update survey",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${hasError ? "#fca5a5" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "all 0.15s ease",
    backgroundColor: hasError ? "#fef2f2" : "#ffffff",
    outline: "none",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
    color: "#334155",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "90%",
          maxWidth: "520px",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#fef3c7",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="#d97706"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                Edit Survey
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: "2px 0 0 0",
                }}
              >
                Update survey details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: "#64748b",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#64748b";
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
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <form id="update-survey-form" onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "14px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  border: "1px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Survey Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter survey name"
                style={inputStyle(!!getFieldError("name"))}
              />
              {getFieldError("name") && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: "6px 0 0 0",
                  }}
                >
                  {getFieldError("name")}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Description <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your survey"
                rows={3}
                style={{
                  ...inputStyle(!!getFieldError("description")),
                  resize: "none",
                }}
              />
              {getFieldError("description") && (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: "6px 0 0 0",
                  }}
                >
                  {getFieldError("description")}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Visibility <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  style={{
                    ...inputStyle(false),
                    appearance: "none",
                    cursor: "pointer",
                    paddingRight: "40px",
                  }}
                >
                  <option value={SurveyVisibility.Public}>
                    Public - Visible to everyone
                  </option>
                  <option value={SurveyVisibility.Group}>
                    Group - Visible to group members
                  </option>
                  <option value={SurveyVisibility.Private}>
                    Private - Invite only
                  </option>
                </select>
                <div
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#64748b"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Start Date <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={inputStyle(!!getFieldError("startdate"))}
                />
                {getFieldError("startdate") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {getFieldError("startdate")}
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>End Date</label>
                <input
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={inputStyle(!!getFieldError("enddate"))}
                />
                {getFieldError("enddate") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {getFieldError("enddate")}
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Min Responses <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  name="minResponse"
                  type="number"
                  min="1"
                  value={formData.minResponse}
                  onChange={handleChange}
                  style={inputStyle(!!getFieldError("minresponse"))}
                />
                {getFieldError("minresponse") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {getFieldError("minresponse")}
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>
                  Max Responses <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  name="maxResponse"
                  type="number"
                  min="1"
                  value={formData.maxResponse}
                  onChange={handleChange}
                  style={inputStyle(!!getFieldError("maxresponse"))}
                />
                {getFieldError("maxresponse") && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {getFieldError("maxresponse")}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div
          style={{
            padding: "20px 28px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: "12px",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              color: "#334155",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="update-survey-form"
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: loading ? "#fcd34d" : "#f59e0b",
              color: "#0f172a",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#d97706";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#f59e0b";
            }}
          >
            {loading ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
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
    </>
  );
}
