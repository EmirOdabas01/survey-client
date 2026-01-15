import { apiClient } from "@/shared/api/api-client";
import type {
  SurveyListResponse,
  SurveyImage,
} from "@/shared/types/survey.types";

class SurveyService {
  async getPublicSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<SurveyListResponse>(
        "/Survey/GetAllSurveyPublic"
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch surveys"
      );
    }
  }

  async getSurveyImage(surveyId: string): Promise<SurveyImage | null> {
    try {
      const response = await apiClient.get<SurveyImage>(
        `/Survey/GetSurveyImage?SurveyId=${surveyId}`
      );
      return response;
    } catch (error) {
      console.log(`No image found for survey ${surveyId}`);
      return null;
    }
  }
}

export const surveyService = new SurveyService();
