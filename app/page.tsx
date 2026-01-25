"use client";

import { SurveyList } from "@/features/surveys/components/survey-list";
import { GroupList } from "@/features/groups/components/group-list";
import { useAuth } from "@/features/auth/context/auth-context";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  function handleSurveyClick(surveyId: string) {
    router.push(`/s/${surveyId}`);
  }

  function handleGroupEnrolled(groupId: number) {
    console.log("Enrolled to group:", groupId);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Survey App
          </h1>
          <p className="text-lg text-gray-600">
            Discover and participate in public surveys
          </p>
        </div>

        {!loading && isAuthenticated && (
          <div className="mb-12">
            <GroupList onGroupEnrolled={handleGroupEnrolled} />
          </div>
        )}

        {!loading && isAuthenticated && (
          <hr className="my-12 border-gray-300" />
        )}

        <SurveyList onSurveyClick={handleSurveyClick} surveyType="public" />
        <SurveyList onSurveyClick={handleSurveyClick} surveyType="private" />
        <SurveyList onSurveyClick={handleSurveyClick} surveyType="group" />
      </div>
    </div>
  );
}
