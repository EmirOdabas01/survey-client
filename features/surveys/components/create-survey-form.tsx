"use client";

import { useState } from "react";
import { surveyService } from "../services/survey.service";
import { SurveyVisibility } from "@/shared/types/survey.types";
import { ApiValidationError } from "@/shared/api/api-client";

interface CreateSurveyFormProps {
  onClose: () => void;
  onCreated: () => void;
}

// Helper to get current datetime in local format for input
function getDefaultStartDate(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15); // 15 minutes from now
  return now.toISOString().slice(0, 16); // Format: "2026-01-25T16:51"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Survey
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
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

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Survey Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter survey name (5-20 characters)"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  getFieldError("name") ? "border-red-500" : "border-gray-300"
                }`}
              />
              {getFieldError("name") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("name")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter survey description (10-100 characters)"
                rows={3}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  getFieldError("description")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {getFieldError("description") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("description")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="visibility"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Visibility *
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  getFieldError("visibility")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value={SurveyVisibility.Public}>Public</option>
                <option value={SurveyVisibility.Group}>Group</option>
                <option value={SurveyVisibility.Private}>Private</option>
              </select>
              {getFieldError("visibility") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("visibility")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getFieldError("startdate")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {getFieldError("startdate") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("startdate")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getFieldError("enddate")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {getFieldError("enddate") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("enddate")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="minResponse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Min Responses *
                </label>
                <input
                  id="minResponse"
                  name="minResponse"
                  type="number"
                  min="1"
                  value={formData.minResponse}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getFieldError("minresponse")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {getFieldError("minresponse") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("minresponse")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="maxResponse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Max Responses *
                </label>
                <input
                  id="maxResponse"
                  name="maxResponse"
                  type="number"
                  min="1"
                  value={formData.maxResponse}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    getFieldError("maxresponse")
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {getFieldError("maxresponse") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError("maxresponse")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Survey"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
