import { apiClient } from "@/shared/api/api-client";
import type {
  SurveyListResponse,
  SurveyImage,
} from "@/shared/types/survey.types";

class SurveyService {
  async getPublicSurveys(): Promise<SurveyListResponse> {
    try {
      const response = apiClient.get<SurveyListResponse>(
        "Survey/GetAllSurveyPublic"
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch public surveys"
      );
    }
  }

  async getSurveyImage(surveyId: string): Promise<SurveyImage> {
    try {
      const response = apiClient.get<SurveyImage>(
        `Survey/GetSurveyImage?id=${surveyId}`
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch survey image"
      );
    }
  }
}

export const surveyService = new SurveyService();
