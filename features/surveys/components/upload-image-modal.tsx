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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File) {
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
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
          maxWidth: "480px",
          overflow: "hidden",
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
                backgroundColor: "#f0fdf4",
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
                stroke="#16a34a"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                Upload Image
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: "2px 0 0 0",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {surveyName}
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

        <div style={{ padding: "24px 28px" }}>
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />

          {!preview ? (
            <div
              onClick={handleChooseFile}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: `2px dashed ${isDragging ? "#2563eb" : "#cbd5e1"}`,
                borderRadius: "16px",
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging ? "#eff6ff" : "#f8fafc",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: isDragging ? "#dbeafe" : "#e2e8f0",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  transition: "all 0.2s ease",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke={isDragging ? "#2563eb" : "#64748b"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: "#0f172a",
                  margin: "0 0 6px 0",
                  fontWeight: 500,
                }}
              >
                {isDragging
                  ? "Drop image here"
                  : "Drag & drop or click to upload"}
              </p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "contain",
                    backgroundColor: "#f8fafc",
                  }}
                />
                <button
                  onClick={handleRemoveFile}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(220, 38, 38, 0.9)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(15, 23, 42, 0.7)";
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  padding: "12px 14px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#334155",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {selectedFile?.name}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                  MB
                </span>
              </div>
            </div>
          )}
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
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            style={{
              flex: 1,
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: loading || !selectedFile ? "#86efac" : "#16a34a",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading || !selectedFile ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!loading && selectedFile)
                e.currentTarget.style.backgroundColor = "#15803d";
            }}
            onMouseLeave={(e) => {
              if (!loading && selectedFile)
                e.currentTarget.style.backgroundColor = "#16a34a";
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
                Uploading...
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Image
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
