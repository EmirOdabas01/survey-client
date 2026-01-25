"use client";

import { useState, useRef } from "react";
import { surveyService } from "../services/survey.service";

interface UploadImageModalProps {
  surveyId: string;
  surveyName: string;
  onClose: () => void;
  onUploaded: () => void;
}

export function UploadImageModal({
  surveyId,
  surveyName,
  onClose,
  onUploaded,
}: UploadImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await surveyService.uploadSurveyImage(surveyId, selectedFile);
      alert("Image uploaded successfully!");
      onUploaded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
          maxWidth: "450px",
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
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
              Upload Survey Image
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
          <p
            style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}
          >
            {surveyName}
          </p>
        </div>

        <div style={{ padding: "20px" }}>
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Upload Area */}
          {!preview ? (
            <div
              onClick={handleChooseFile}
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "40px 20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f9fafb",
              }}
            >
              <svg
                style={{
                  width: "48px",
                  height: "48px",
                  margin: "0 auto 12px",
                  color: "#9ca3af",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  margin: "0 0 4px 0",
                }}
              >
                Click to select an image
              </p>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f3f4f6",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                  }}
                />
                <button
                  onClick={handleRemoveFile}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedFile?.name}
              </p>
            </div>
          )}
        </div>

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
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: loading || !selectedFile ? "#93c5fd" : "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading || !selectedFile ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
    </>
  );
}
