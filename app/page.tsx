"use client";

import { SurveyList } from "@/features/surveys/components/survey-list";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function handleSurveyClick(surveyId: string) {
    router.push(`/surveys/${surveyId}`);
  }

  return (
    <div className="p-6">
      <SurveyList onSurveyClick={handleSurveyClick} />
    </div>
  );
}
