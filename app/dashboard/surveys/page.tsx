"use client";

import { useState } from "react";
import { CreateSurveyForm } from "@/features/surveys/components/create-survey-form";

export default function DashboardSurveysPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  function handleSurveyCreated() {
    console.log("Survey created, will refresh list later");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
          <p className="text-gray-600 mt-1">Create and manage your surveys</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Survey
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Survey list will be displayed here</p>
        <p className="text-gray-400 text-sm mt-2">
          We'll add GetUserSurveys next
        </p>
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
